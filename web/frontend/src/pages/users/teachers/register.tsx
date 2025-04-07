import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../utils/withAuth';
import Wrapper from '@/components/wrapper/Wrapper';
import FormInput from '@/components/forms/FormInput';
import ToggleSwitch from '@/components/forms/ToggleSwitch';
import { formatCPF, formatCEP, getNumericValue } from '../../utils/maskUtils';
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

const TeacherRegister = () => {
  const router = useRouter();
  
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
  const [password, setPassword] = useState<string>('');
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  // Extract values for easier access in the component
  const { personalInfo, address, professionalInfo } = formData;
  
  // Load organization ID from token on component mount
  useEffect(() => {
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
  }, []);

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

  // Handle CPF changes with validation and password sync
  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedCpf = e.target.value;
    updatePersonalInfo('cpf', maskedCpf);
    
    // Set password to numeric-only CPF value
    const numericCpf = getNumericValue(maskedCpf);
    setPassword(numericCpf);
    
    // Validate CPF format on change if user has already tried to submit
    if (attemptedSubmit) {
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

// Form submission handler
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

  try {
    const numericCpf = getNumericValue(personalInfo.cpf);
    const numericCep = getNumericValue(address.cep);
    
    // Preparação dos dados exatamente como enviados pelo Postman
    const birthDate = personalInfo.birthDate ? 
      new Date(personalInfo.birthDate).toISOString() : 
      null;
    
    const hireDate = professionalInfo.hireDate ? 
      new Date(professionalInfo.hireDate).toISOString() : 
      null;
    
    // Dados no formato exato do Postman
    const requestBody = {
      name: personalInfo.name,
      cpf: numericCpf,
      email: personalInfo.email,
      password: numericCpf, // Password is same as numeric CPF
      role: 'PROFESSOR',
      address: address.street,
      cep: numericCep,
      numberAdress: address.number,
      organizationId,
      isActive: professionalInfo.isActive,
      registrationNumber: professionalInfo.registrationNumber || null,
      birthDate,
      specialization: professionalInfo.specialization || null,
      hireDate
    };
    
    console.log('Enviando dados para API:', JSON.stringify(requestBody, null, 2));
    
    // Usando o mesmo endpoint que funciona no Postman
    const response = await fetch('http://localhost:4000/users', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}` // Adicionando token se necessário
      },
      body: JSON.stringify(requestBody),
    });

    const responseStatus = response.status;
    console.log('Status da resposta:', responseStatus);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Registro de professor falhou, tente novamente';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Resposta de erro não é JSON:', errorText);
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

    router.push('/users/teachers/');
  } catch (err: any) {
    setError(err.message);
    console.error('Erro durante o registro:', err);
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
                    Cadastro de Professor
                  </h5>
                </div>
                <div className="p-5 border-t border-gray-100">
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
                          onChange={() => updateProfessionalInfo('isActive', !professionalInfo.isActive)}
                        />
                      </div>
                    </div>

                    {/* Submit Button Section */}
                    <div className="grid grid-cols-1 mt-6">
                      <div className="flex justify-center mt-10">
                        <button
                          type="submit"
                          className="py-2 px-8 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white rounded-md"
                        >
                          Cadastrar
                        </button>
                      </div>
                      {error && <p className="mt-2 text-red-500 text-center">{error}</p>}
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

export default withAuth(TeacherRegister, ['SECRETARIO', 'COORDENADOR', 'DIRETOR']);