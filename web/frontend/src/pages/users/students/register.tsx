import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../utils/withAuth';
import Wrapper from '@/components/wrapper/Wrapper';
import FormInput from '@/components/forms/FormInput';
import ToggleSwitch from '@/components/forms/ToggleSwitch';
import { formatCPF, formatCEP, getNumericValue } from '../../utils/maskUtils';
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
    enrollmentDate: string;
    isActive: boolean;
  };
}

const StudentRegister = () => {
  const router = useRouter();

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
      enrollmentDate: '',
      isActive: true,
    },
  });

  // additional state
  const [password, setPassword] = useState<string>('');
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  // extract values for easier access
  const { personalInfo, address, academicInfo } = formData;

  // Dentro do useEffect para obter o organizationId

  useEffect(() => {
    const fetchOrganizationId = () => {
      const token = sessionStorage.getItem('token');

      if (!token) {
        setError('Usuário não está autenticado');
        router.push('/login');
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Token decodificado:', decoded); // Verificar o token completo

        if (!decoded.organizationId) {
          setError('Não foi possível obter a organização do usuário');
          return;
        }

        setOrganizationId(decoded.organizationId);
        console.log('ID da organização definido:', decoded.organizationId);
      } catch (error) {
        console.error('Falha ao decodificar o token:', error);
        setError('Erro ao obter informações do usuário logado');
      }
    };

    fetchOrganizationId();
  }, [router]);

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
    setFormData({
      ...formData,
      academicInfo: {
        ...academicInfo,
        [field]: value,
      },
    });
  };

  // clear error for a field
  const clearError = (field: keyof ValidationErrors) => {
    if (attemptedSubmit && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // handle cpf changes with validation and password sync
  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedCpf = e.target.value;
    updatePersonalInfo('cpf', maskedCpf);

    // set password to numeric-only cpf value
    const numericCpf = getNumericValue(maskedCpf);
    setPassword(numericCpf);

    // validate cpf format if user has already tried to submit
    if (attemptedSubmit) {
      if (!numericCpf) {
        setErrors((prev) => ({ ...prev, cpf: 'cpf é obrigatório' }));
      } else if (numericCpf.length !== 11) {
        setErrors((prev) => ({ ...prev, cpf: 'cpf deve conter 11 dígitos' }));
      } else {
        clearError('cpf');
      }
    }
  };

  // handle cep changes with validation
  const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedCep = e.target.value;
    updateAddress('cep', maskedCep);

    // validate cep format if user has already tried to submit
    if (attemptedSubmit) {
      const numericCep = getNumericValue(maskedCep);
      if (!numericCep) {
        setErrors((prev) => ({ ...prev, cep: 'cep é obrigatório' }));
      } else if (numericCep.length !== 8) {
        setErrors((prev) => ({ ...prev, cep: 'cep deve conter 8 dígitos' }));
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
    if (!name.trim()) newErrors.name = 'nome é obrigatório';
    if (!email.trim()) newErrors.email = 'email é obrigatório';
    if (!getNumericValue(cpf)) newErrors.cpf = 'cpf é obrigatório';
    if (!street.trim()) newErrors.address = 'endereço é obrigatório';
    if (!number.trim()) newErrors.numberAdress = 'número é obrigatório';
    if (!getNumericValue(cep)) newErrors.cep = 'cep é obrigatório';

    // format validations
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'email em formato inválido';
    }

    // cpf length validation
    const numericCpf = getNumericValue(cpf);
    if (numericCpf && numericCpf.length !== 11) {
      newErrors.cpf = 'cpf deve conter 11 dígitos';
    }

    // cep length validation
    const numericCep = getNumericValue(cep);
    if (numericCep && numericCep.length !== 8) {
      newErrors.cep = 'cep deve conter 8 dígitos';
    }

    return newErrors;
  };

  // form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);

    // stop submission if validation fails
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    setError('');

    try {
      const numericCpf = getNumericValue(personalInfo.cpf);
      const numericCep = getNumericValue(address.cep);

      // preparing data exactly as needed for the API
      const birthDate = personalInfo.birthDate
        ? new Date(personalInfo.birthDate).toISOString()
        : null;

      const enrollmentDate = academicInfo.enrollmentDate
        ? new Date(academicInfo.enrollmentDate).toISOString()
        : null;

      // Adicionando verificações de consistência
      if (!organizationId || organizationId <= 0) {
        setError('ID da organização inválido. Faça login novamente.');
        console.error('organizationId inválido:', organizationId);
        return;
      }

      // Converta explicitamente para número para garantir formato consistente
      const orgId = Number(organizationId);

      const requestBody = {
        name: personalInfo.name,
        cpf: numericCpf,
        email: personalInfo.email,
        password: numericCpf,
        role: 'USER',
        address: address.street,
        cep: numericCep,
        numberAdress: address.number,
        organizationId: orgId,
        isActive: academicInfo.isActive,
        enrollmentNumber: academicInfo.enrollmentNumber || null,
        birthDate,
        enrollmentDate,
      };
      
      console.log('sending data to api:', JSON.stringify(requestBody, null, 2));
      console.log('organizationId type:', typeof orgId);

      // API request to create student
      const response = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseStatus = response.status;
      console.log('response status:', responseStatus);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'registro de estudante falhou, tente novamente';

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('error response is not json:', errorText);
        }

        throw new Error(errorMessage);
      }

      // processing success response
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

      router.push('/users/students/');
    } catch (err: any) {
      setError(err.message);
      console.error('error during registration:', err);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Estudantes', href: '/users/students' },
    { label: 'Cadastrar', active: true },
  ];

  return (
    <Wrapper>
      <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
        <div className="layout-specing">
          <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
            <div className="py-4">
              <div className="shadow-sm rounded bg-white">
                <div className="p-5">
                  <h5 className="text-lg font-semibold">Cadastrar Estudante</h5>
                </div>
                <div className="p-5 border-t border-gray-100">
                  {/* Breadcrumbs */}
                  <Breadcrumb items={breadcrumbItems} />
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
                          onChange={(e) =>
                            updatePersonalInfo('birthDate', e.target.value)
                          }
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
                          onChange={(e) =>
                            updateAcademicInfo(
                              'enrollmentNumber',
                              e.target.value,
                            )
                          }
                          placeholder="Digite a Matrícula"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                        <FormInput
                          label="Data de Matrícula"
                          value={academicInfo.enrollmentDate}
                          onChange={(e) =>
                            updateAcademicInfo('enrollmentDate', e.target.value)
                          }
                          type="date"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-1 lg:col-span-1 flex items-end">
                        <ToggleSwitch
                          label="Ativo"
                          checked={academicInfo.isActive}
                          onChange={() =>
                            updateAcademicInfo(
                              'isActive',
                              !academicInfo.isActive,
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* submit button section */}
                    <div className="grid grid-cols-1 mt-6">
                      <div className="flex justify-center mt-10">
                        <button
                          type="submit"
                          className="py-2 px-8 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white rounded-md"
                        >
                          Cadastrar
                        </button>
                      </div>
                      {error && (
                        <p className="mt-2 text-red-500 text-center">{error}</p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default withAuth(StudentRegister, ['DIRETOR']);
