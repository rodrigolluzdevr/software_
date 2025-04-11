import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../../utils/withAuth';
import Wrapper from '@/components/wrapper/Wrapper';
import FormInput from '@/components/forms/FormInput';
import ToggleSwitch from '@/components/forms/ToggleSwitch';
import { formatCPF, formatCEP, getNumericValue } from '../../../utils/maskUtils';
import { jwtDecode } from 'jwt-decode';
import { Breadcrumb } from '@/components/common/Breadcrumb';

// types
interface JwtPayload {
  sub: number;
  cpf: string;
  role: string;
  organizationId: number;
}

interface ValidationErrors {
  name?: string;
  cpf?: string;
  email?: string;
  address?: string;
  cep?: string;
  numberAdress?: string;
}

interface StudentFormData {
  personalInfo: {
    name: string;
    email: string;
    cpf: string;
    birthDate: string;
  };
  address: {
    cep: string;
    street: string;
    number: string;
  };
  academicInfo: {
    enrollmentNumber: string;
    grade: string;
    enrollmentDate: string;
    isActive: boolean;
  };
}

// user data interface from api
interface StudentData {
  id: number;
  name: string;
  email: string;
  cpf: string;
  address: string;
  cep: string;
  numberAdress: string;
  organizationId: number;
  isActive: boolean;
  enrollmentNumber?: string;
  birthDate?: string;
  grade?: string;
  enrollmentDate?: string;
  role: string;
}

// converts the iso string to a Date object and extracts only the yyyy-mm-dd part
const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error('error formatting date:', e);
    return '';
  }
};

const StudentUpdate = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // form state with structured data model
  const [formData, setFormData] = useState<StudentFormData>({
    personalInfo: {
      name: '',
      email: '',
      cpf: '',
      birthDate: '',
    },
    address: {
      cep: '',
      street: '',
      number: '',
    },
    academicInfo: {
      enrollmentNumber: '',
      grade: '',
      enrollmentDate: '',
      isActive: true,
    },
  });

  // additional state
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  // extract values for easier access in the component
  const { personalInfo, address, academicInfo } = formData;
  
  // debug state to help track issues
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // load student data when component mounts and id is available
  useEffect(() => {
    // wait for router to be ready and have the id parameter
    if (!router.isReady) return;
    
    if (!id) {
      setDebugInfo('no id parameter found in url');
      return;
    }
    
    setDebugInfo(`found id: ${id}, fetching data...`);
    
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        console.log(`fetching data for student id: ${id}`);
        
        // get the authentication token
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error('user is not authenticated');
        }
        
        // include the token in the authorization header
        const response = await fetch(`http://localhost:4000/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`api error (${response.status}):`, errorText);
          
          // specific handling for different error codes
          if (response.status === 401) {
            setError('session expired or user without permission. please log in again.');
          } else if (response.status === 404) {
            setError('student not found');
          } else {
            setError(`error loading data (${response.status})`);
          }
          
          throw new Error(`failed to fetch student data (${response.status})`);
        }
        
        const data: StudentData = await response.json();
        console.log('student data received:', data);
        console.log('student isActive status:', data.isActive);
        setDebugInfo(`data loaded successfully for student: ${data.name}`);
        
        // map api data to our form structure, including date formatting
        setFormData({
          personalInfo: {
            name: data.name || '',
            email: data.email || '',
            cpf: formatCPF(data.cpf) || '',
            birthDate: formatDateForInput(data.birthDate),
          },
          address: {
            cep: formatCEP(data.cep) || '',
            street: data.address || '',
            number: data.numberAdress || '',
          },
          academicInfo: {
            enrollmentNumber: data.enrollmentNumber || '',
            grade: data.grade || '',
            enrollmentDate: formatDateForInput(data.enrollmentDate),
            isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
          },
        });
        
        setOrganizationId(data.organizationId);
      } catch (error) {
        console.error('error fetching student data:', error);
        setDebugInfo(`error: ${error instanceof Error ? error.message : 'unknown error'}`);
        if (!(error instanceof Error && error.message.includes('401'))) {
          setError('error loading student data');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [router.isReady, id]);
  
  // load organization id from token if not set from student data
  useEffect(() => {
    if (organizationId !== 0) return;
    
    const fetchOrganizationId = () => {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setError('user is not authenticated');
        return;
      }
      
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setOrganizationId(decoded.organizationId);
      } catch (error) {
        console.error('failed to decode token:', error);
        setError('error getting logged user info');
      }
    };
    
    fetchOrganizationId();
  }, [organizationId]);

  // field update functions
  const updatePersonalInfo = (field: string, value: string) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...personalInfo,
        [field]: value,
      },
    });
  };

  const updateAddress = (field: string, value: string) => {
    setFormData({
      ...formData,
      address: {
        ...address,
        [field]: value,
      },
    });
  };

  const updateAcademicInfo = (field: string, value: string | boolean) => {
    console.log(`updating field ${field} to:`, value);
    setFormData({
      ...formData,
      academicInfo: {
        ...academicInfo,
        [field]: value,
      },
    });
  };

  // function to control the active status change
  const handleActiveStatusChange = (newValue: boolean) => {
    const currentStatus = academicInfo.isActive;
    console.log('changing active status from:', currentStatus, 'to:', newValue);
    
    setFormData(prevState => {
      const updatedData = {
        ...prevState,
        academicInfo: {
          ...prevState.academicInfo,
          isActive: newValue,
        },
      };
      
      console.log('new isActive state after update:', updatedData.academicInfo.isActive);
      
      return updatedData;
    });
  };

  // clear error for a field
  const clearError = (field: keyof ValidationErrors) => {
    if (attemptedSubmit && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // handle cpf changes with validation
  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedCpf = e.target.value;
    updatePersonalInfo('cpf', maskedCpf);
    
    if (attemptedSubmit) {
      const numericCpf = getNumericValue(maskedCpf);
      if (!numericCpf) {
        setErrors(prev => ({ ...prev, cpf: 'cpf is required' }));
      } else if (numericCpf.length !== 11) {
        setErrors(prev => ({ ...prev, cpf: 'cpf must have 11 digits' }));
      } else {
        clearError('cpf');
      }
    }
  };

  // handle cep changes with validation
  const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedCep = e.target.value;
    updateAddress('cep', maskedCep);
    
    if (attemptedSubmit) {
      const numericCep = getNumericValue(maskedCep);
      if (!numericCep) {
        setErrors(prev => ({ ...prev, cep: 'cep is required' }));
      } else if (numericCep.length !== 8) {
        setErrors(prev => ({ ...prev, cep: 'cep must have 8 digits' }));
      } else {
        clearError('cep');
      }
    }
  };

  // form validation logic
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    const { name, email, cpf } = personalInfo;
    const { street, number, cep } = address;
    
    // required field validations
    if (!name.trim()) newErrors.name = 'name is required';
    if (!email.trim()) newErrors.email = 'email is required';
    if (!getNumericValue(cpf)) newErrors.cpf = 'cpf is required';
    if (!street.trim()) newErrors.address = 'address is required';
    if (!number.trim()) newErrors.numberAdress = 'number is required';
    if (!getNumericValue(cep)) newErrors.cep = 'cep is required';
    
    // format validations
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'invalid email format';
    }
    
    // cpf length validation
    const numericCpf = getNumericValue(cpf);
    if (numericCpf && numericCpf.length !== 11) {
      newErrors.cpf = 'cpf must have 11 digits';
    }
    
    // cep length validation
    const numericCep = getNumericValue(cep);
    if (numericCep && numericCep.length !== 8) {
      newErrors.cep = 'cep must have 8 digits';
    }
    
    return newErrors;
  };

  // form submission handler for updating student
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    // stop submission if validation fails
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setError('');
    setLoading(true);
    setDebugInfo(`submitting update for student id: ${id}...`);

    try {
      const numericCpf = getNumericValue(personalInfo.cpf);
      const numericCep = getNumericValue(address.cep);
      
      console.log('isActive value before building payload:', academicInfo.isActive);
      
      // preparing the data as sent by postman, formatting dates for the backend
      let birthDate = null;
      if (personalInfo.birthDate && personalInfo.birthDate.trim() !== '') {
        birthDate = new Date(personalInfo.birthDate).toISOString();
      }
      
      let enrollmentDate = null;
      if (academicInfo.enrollmentDate && academicInfo.enrollmentDate.trim() !== '') {
        enrollmentDate = new Date(academicInfo.enrollmentDate).toISOString();
      }
      
      // handle text fields to ensure non-null values
      const enrollmentNumber =
        academicInfo.enrollmentNumber && academicInfo.enrollmentNumber.trim() !== ''
          ? academicInfo.enrollmentNumber.trim()
          : null;
      
      const grade =
        academicInfo.grade && academicInfo.grade.trim() !== ''
          ? academicInfo.grade.trim()
          : null;
      
      // data object to send, ensuring isActive is boolean
      const requestBody = {
        name: personalInfo.name,
        cpf: numericCpf,
        email: personalInfo.email,
        role: 'USER',
        address: address.street,
        cep: numericCep,
        numberAdress: address.number,
        organizationId,
        isActive: Boolean(academicInfo.isActive),
        enrollmentNumber,
        birthDate,
        grade,
        enrollmentDate
      };
      
      // get the authentication token
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('user is not authenticated');
        return;
      }
      
      // using patch here
      const response = await fetch(`http://localhost:4000/users/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`api update error (${response.status}):`, errorText);
        
        let errorMessage = 'student update failed, please try again';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('error response is not json:', errorText);
        }
        
        if (response.status === 401) {
          setError('session expired or user without permission. please log in again.');
        } else if (response.status === 403) {
          setError('you do not have permission to update this student');
        } else if (response.status === 404) {
          setError('student not found');
        } else {
          setError(errorMessage);
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      let responseData = {};
      
      try {
        if (responseText) {
          responseData = JSON.parse(responseText);
          console.log('api response (success):', responseData);
        }
      } catch (e) {
        console.error('error processing response:', e);
      }

      setDebugInfo('update successful, redirecting...');
      router.push('/users/students/');
    } catch (err: any) {
      setError(err.message);
      setDebugInfo(`error during update: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Estudantes', href: '/users/students' },
    { label: 'Editar', active: true },
  ];

  return (
    <Wrapper>
      <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
        <div className="layout-specing">
          <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
            <div className="py-4">
              <div className="shadow-sm rounded bg-white">
                <div className="p-5">
                  <h5 className="text-lg font-semibold">
                    Editar Estudante
                  </h5>
                </div>
                <div className="p-5 border-t border-gray-100">
                  {/* Breadcrumbs */}
                  <Breadcrumb items={breadcrumbItems} />

                  {loading && !error ? (
                    <div className="text-center py-8">
                      <p>carregando estudante...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      <p>{error}</p>
                      <button 
                        className="mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                        onClick={() => router.back()}
                      >
                        voltar
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {/* personal information section */}
                      <div className="grid grid-cols-6 gap-6 mb-6">
                        <div className="col-span-6 sm:col-span-2 md:col-span-3 lg:col-span-2">
                          <FormInput
                            label="Nome"
                            value={personalInfo.name}
                            onChange={(e) => {
                              updatePersonalInfo('name', e.target.value);
                              if (attemptedSubmit && e.target.value.trim()) {
                                clearError('name');
                              }
                            }}
                            placeholder="Digite o Nome"
                            required
                            error={errors.name}
                            attemptedSubmit={attemptedSubmit}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3 md:col-span-2 lg:col-span-2">
                          <FormInput
                            label="Email"
                            value={personalInfo.email}
                            onChange={(e) => {
                              updatePersonalInfo('email', e.target.value);
                              if (attemptedSubmit && e.target.value.trim()) {
                                clearError('email');
                              }
                            }}
                            type="email"
                            placeholder="Digite o Email"
                            required
                            error={errors.email}
                            attemptedSubmit={attemptedSubmit}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-1">
                          <FormInput
                            label="CPF"
                            value={personalInfo.cpf}
                            onChange={handleCpfChange}
                            placeholder="Digite o CPF"
                            required
                            error={errors.cpf}
                            attemptedSubmit={attemptedSubmit}
                            mask={formatCPF}
                            maxLength={14}
                          />
                        </div>

                        <div className="col-span-6 md:col-span-2 lg:col-span-1">
                          <FormInput
                            label="Data de Nascimento"
                            value={personalInfo.birthDate}
                            onChange={(e) => updatePersonalInfo('birthDate', e.target.value)}
                            type="date"
                          />
                        </div>
                      </div>

                      {/* address section */}
                      <div className="grid grid-cols-6 gap-6 mb-6">
                        <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                          <FormInput
                            label="CEP"
                            value={address.cep}
                            onChange={handleCepChange}
                            placeholder="Digite o CEP"
                            required
                            error={errors.cep}
                            attemptedSubmit={attemptedSubmit}
                            mask={formatCEP}
                            maxLength={9}
                          />
                        </div>
                      
                        <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                          <FormInput
                            label="Endereço"
                            value={address.street}
                            onChange={(e) => {
                              updateAddress('street', e.target.value);
                              if (attemptedSubmit && e.target.value.trim()) {
                                clearError('address');
                              }
                            }}
                            placeholder="Digite o Endereço"
                            required
                            error={errors.address}
                            attemptedSubmit={attemptedSubmit}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                          <FormInput
                            label="Número"
                            value={address.number}
                            onChange={(e) => {
                              updateAddress('number', e.target.value);
                              if (attemptedSubmit && e.target.value.trim()) {
                                clearError('numberAdress');
                              }
                            }}
                            placeholder="Digite o Número"
                            required
                            error={errors.numberAdress}
                            attemptedSubmit={attemptedSubmit}
                          />
                        </div>
                      </div>

                      {/* academic information section */}
                      <div className="grid grid-cols-6 gap-6 mb-6">
                        <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                          <FormInput
                            label="Matrícula"
                            value={academicInfo.enrollmentNumber}
                            onChange={(e) => updateAcademicInfo('enrollmentNumber', e.target.value)}
                            placeholder="Digite a Matrícula"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-1">
                          <FormInput
                            label="Série/Turma"
                            value={academicInfo.grade}
                            onChange={(e) => updateAcademicInfo('grade', e.target.value)}
                            placeholder="Ex: 9° Ano, 2° Série"
                            maxLength={100}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                          <FormInput
                            label="Data de Matrícula"
                            value={academicInfo.enrollmentDate}
                            onChange={(e) => updateAcademicInfo('enrollmentDate', e.target.value)}
                            type="date"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-1 lg:col-span-1 flex items-end">
                          <div className="flex items-center">
                            <ToggleSwitch
                              label="Status"
                              checked={academicInfo.isActive}
                              onChange={handleActiveStatusChange}
                            />
                            {process.env.NODE_ENV !== 'production' && (
                              <span className="ml-2 text-xs text-gray-500">
                                {academicInfo.isActive ? 'Ativo' : 'Inativo'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* submit button section */}
                      <div className="grid grid-cols-1 mt-6">
                        <div className="flex justify-center gap-4 mt-10">
                          <button
                            type="button"
                            onClick={() => router.back()}
                            className="py-2 px-8 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-gray-200 hover:bg-gray-300 border-gray-200 hover:border-gray-300 text-gray-700 rounded-md"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-8 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white rounded-md disabled:opacity-70"
                          >
                            {loading ? 'Salvando...' : 'Atualizar'}
                          </button>
                        </div>
                        {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default withAuth(StudentUpdate, ['SECRETARIO', 'COORDENADOR', 'DIRETOR']);