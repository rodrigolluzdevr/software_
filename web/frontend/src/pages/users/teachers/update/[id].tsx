import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../../utils/withAuth';
import Wrapper from '@/components/wrapper/Wrapper';
import FormInput from '@/components/forms/FormInput';
import ToggleSwitch from '@/components/forms/ToggleSwitch';
import { formatCPF, formatCEP, getNumericValue } from '../../../utils/maskUtils';
import { jwtDecode } from 'jwt-decode';

// Types
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

interface TeacherFormData {
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
  professionalInfo: {
    registrationNumber: string;
    specialization: string;
    hireDate: string;
    isActive: boolean;
  };
}

// User data interface from API
interface TeacherData {
  id: number;
  name: string;
  email: string;
  cpf: string;
  address: string;
  cep: string;
  numberAdress: string;
  organizationId: number;
  isActive: boolean;
  registrationNumber?: string;
  birthDate?: string;
  specialization?: string;
  hireDate?: string;
  role: string;
}

const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    // Converte a string ISO para objeto Date e extrai apenas a parte YYYY-MM-DD
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
};


const TeacherUpdate = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Form state with structured data model
  const [formData, setFormData] = useState<TeacherFormData>({
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
    professionalInfo: {
      registrationNumber: '',
      specialization: '',
      hireDate: '',
      isActive: true,
    },
  });

  // Additional state
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  // Extract values for easier access in the component
  const { personalInfo, address, professionalInfo } = formData;
  
  // Debug state to help track issues
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Load teacher data when component mounts and ID is available
  useEffect(() => {
    // Wait for router to be ready and have the ID parameter
    if (!router.isReady) return;
    
    if (!id) {
      setDebugInfo('No ID parameter found in URL');
      return;
    }
    
    setDebugInfo(`Found ID: ${id}, fetching data...`);
    
    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching data for teacher ID: ${id}`);
        
        // Obter o token de autenticação
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error('Usuário não está autenticado');
        }
        
        // Incluir o token no cabeçalho Authorization
        const response = await fetch(`http://localhost:4000/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          // ... código de tratamento de erro existente ...
        }
        
        const data: TeacherData = await response.json();
        console.log("Teacher data received:", data);
        setDebugInfo(`Data loaded successfully for teacher: ${data.name}`);
        
        // Map API data to our form structure, com formatação adequada das datas
        setFormData({
          personalInfo: {
            name: data.name || '',
            email: data.email || '',
            cpf: formatCPF(data.cpf) || '',
            birthDate: formatDateForInput(data.birthDate), // Formata a data
          },
          address: {
            cep: formatCEP(data.cep) || '',
            street: data.address || '',
            number: data.numberAdress || '',
          },
          professionalInfo: {
            registrationNumber: data.registrationNumber || '',
            specialization: data.specialization || '',
            hireDate: formatDateForInput(data.hireDate), // Formata a data
            isActive: data.isActive || true,
          },
        });
        
        setOrganizationId(data.organizationId);
      } catch (error) {
        // ... código de tratamento de erro existente ...
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeacherData();
  }, [router.isReady, id]); // Add router.isReady to dependencies
  
  // Load organization ID from token if not set from teacher data
  useEffect(() => {
    if (organizationId !== 0) return;
    
    const fetchOrganizationId = () => {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        setError('Usuário não está autenticado');
        return;
      }
      
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setOrganizationId(decoded.organizationId);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setError('Erro ao obter informações do usuário logado');
      }
    };
    
    fetchOrganizationId();
  }, [organizationId]);

  // Field update functions
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

  const updateProfessionalInfo = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      professionalInfo: {
        ...professionalInfo,
        [field]: value,
      },
    });
  };

  // Clear error for a field
  const clearError = (field: keyof ValidationErrors) => {
    if (attemptedSubmit && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle CPF changes with validation
  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedCpf = e.target.value;
    updatePersonalInfo('cpf', maskedCpf);
    
    // Validate CPF format on change if user has already tried to submit
    if (attemptedSubmit) {
      const numericCpf = getNumericValue(maskedCpf);
      if (!numericCpf) {
        setErrors(prev => ({ ...prev, cpf: "CPF é obrigatório" }));
      } else if (numericCpf.length !== 11) {
        setErrors(prev => ({ ...prev, cpf: "CPF deve conter 11 dígitos" }));
      } else {
        clearError('cpf');
      }
    }
  };

  // Handle CEP changes with validation
  const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedCep = e.target.value;
    updateAddress('cep', maskedCep);
    
    // Validate CEP format on change if user has already tried to submit
    if (attemptedSubmit) {
      const numericCep = getNumericValue(maskedCep);
      if (!numericCep) {
        setErrors(prev => ({ ...prev, cep: "CEP é obrigatório" }));
      } else if (numericCep.length !== 8) {
        setErrors(prev => ({ ...prev, cep: "CEP deve conter 8 dígitos" }));
      } else {
        clearError('cep');
      }
    }
  };

  // Form validation logic
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    const { name, email, cpf } = personalInfo;
    const { street, number, cep } = address;
    
    // Required field validations
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    if (!getNumericValue(cpf)) newErrors.cpf = "CPF é obrigatório";
    if (!street.trim()) newErrors.address = "Endereço é obrigatório";
    if (!number.trim()) newErrors.numberAdress = "Número é obrigatório";
    if (!getNumericValue(cep)) newErrors.cep = "CEP é obrigatório";
    
    // Format validations
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email em formato inválido";
    }
    
    // CPF length validation
    const numericCpf = getNumericValue(cpf);
    if (numericCpf && numericCpf.length !== 11) {
      newErrors.cpf = "CPF deve conter 11 dígitos";
    }
    
    // CEP length validation
    const numericCep = getNumericValue(cep);
    if (numericCep && numericCep.length !== 8) {
      newErrors.cep = "CEP deve conter 8 dígitos";
    }
    
    return newErrors;
  };

// Form submission handler for updating teacher
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setAttemptedSubmit(true);
  
  const validationErrors = validateForm();
  setErrors(validationErrors);
  
  // Stop submission if validation fails
  if (Object.keys(validationErrors).length > 0) {
    const firstErrorElement = document.querySelector('.border-red-500');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  setError('');
  setLoading(true);
  setDebugInfo(`Submitting update for teacher ID: ${id}...`);

  try {
    const numericCpf = getNumericValue(personalInfo.cpf);
    const numericCep = getNumericValue(address.cep);
    
    // Preparação dos dados exatamente como enviados pelo Postman
    // Formatando corretamente as datas para o backend
    let birthDate = null;
    if (personalInfo.birthDate && personalInfo.birthDate.trim() !== '') {
      birthDate = new Date(personalInfo.birthDate).toISOString();
    }
    
    let hireDate = null;
    if (professionalInfo.hireDate && professionalInfo.hireDate.trim() !== '') {
      hireDate = new Date(professionalInfo.hireDate).toISOString();
    }
    
    // Tratamento dos campos de texto para garantir valores não nulos
    const registrationNumber = professionalInfo.registrationNumber && 
      professionalInfo.registrationNumber.trim() !== '' ? 
      professionalInfo.registrationNumber.trim() : null;
      
    const specialization = professionalInfo.specialization && 
      professionalInfo.specialization.trim() !== '' ? 
      professionalInfo.specialization.trim() : null;
    
    // Objeto de dados a ser enviado, no mesmo formato que o POST
    const requestBody = {
      name: personalInfo.name,
      cpf: numericCpf,
      email: personalInfo.email,
      role: 'PROFESSOR',
      address: address.street,
      cep: numericCep,
      numberAdress: address.number,
      organizationId,
      isActive: professionalInfo.isActive,
      registrationNumber,
      birthDate,
      specialization,
      hireDate
    };
    
    console.log('Enviando dados para atualização:', JSON.stringify(requestBody, null, 2));
    
    // Obter o token de autenticação
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Usuário não está autenticado');
      return;
    }
    
    // Usando PATCH como solicitado
    const response = await fetch(`http://localhost:4000/users/${id}`, {
      method: 'PATCH', // Usando PATCH em vez de PUT
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    const responseStatus = response.status;
    console.log('Status da resposta:', responseStatus);
    console.log('Headers da resposta:', Object.fromEntries([...response.headers]));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API update error (${response.status}):`, errorText);
      
      let errorMessage = 'Atualização de professor falhou, tente novamente';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Resposta de erro não é JSON:', errorText);
      }
      
      if (response.status === 401) {
        setError('Sessão expirada ou usuário sem permissão. Faça login novamente.');
      } else if (response.status === 403) {
        setError('Sem permissão para atualizar este professor');
      } else if (response.status === 404) {
        setError('Professor não encontrado');
      } else {
        setError(errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    // Processando a resposta de sucesso
    const responseText = await response.text();
    let responseData = {};
    
    try {
      if (responseText) {
        responseData = JSON.parse(responseText);
        console.log('Resposta da API (sucesso):', responseData);
      }
    } catch (e) {
      console.error('Erro ao processar resposta:', e);
    }

    setDebugInfo('Update successful, redirecting...');
    router.push('/users/teachers/');
  } catch (err: any) {
    setError(err.message);
    setDebugInfo(`Error during update: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <Wrapper>
      <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
        <div className="layout-specing">
          <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
            <div className="py-4">
              <div className="shadow-sm rounded bg-white">
                <div className="p-5">
                  <h5 className="text-lg font-semibold">
                    Atualização de Professor {id ? `#${id}` : ''}
                  </h5>
                  {process.env.NODE_ENV !== 'production' && debugInfo && (
                    <p className="text-xs text-gray-500 mt-1">{debugInfo}</p>
                  )}
                </div>
                <div className="p-5 border-t border-gray-100">
                  {loading && !error ? (
                    <div className="text-center py-8">
                      <p>Carregando dados do professor...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      <p>{error}</p>
                      <button 
                        className="mt-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                        onClick={() => router.back()}
                      >
                        Voltar
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {/* Personal Information Section */}
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

                      {/* Address Section */}
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

                      {/* Professional Information Section */}
                      <div className="grid grid-cols-6 gap-6 mb-6">
                        <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                          <FormInput
                            label="Matrícula"
                            value={professionalInfo.registrationNumber}
                            onChange={(e) => updateProfessionalInfo('registrationNumber', e.target.value)}
                            placeholder="Digite a Matrícula"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3 lg:col-span-1">
                          <FormInput
                            label="Especialização"
                            value={professionalInfo.specialization}
                            onChange={(e) => updateProfessionalInfo('specialization', e.target.value)}
                            placeholder="Ex: Matemática, Física"
                            maxLength={100}
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                          <FormInput
                            label="Data de Contratação"
                            value={professionalInfo.hireDate}
                            onChange={(e) => updateProfessionalInfo('hireDate', e.target.value)}
                            type="date"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-1 lg:col-span-1 flex items-end">
                        <ToggleSwitch
  label="Ativo"
  checked={professionalInfo.isActive}
  onChange={(newValue) => {
    updateProfessionalInfo('isActive', newValue);
  }}
/>
                        </div>
                      </div>

                      {/* Submit Button Section */}
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

export default withAuth(TeacherUpdate, ['SECRETARIO', 'COORDENADOR', 'DIRETOR']);