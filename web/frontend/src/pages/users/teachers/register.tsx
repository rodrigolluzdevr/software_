import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../utils/withAuth';
import Wrapper from '@/components/wrapper/Wrapper';
import FormInput from '@/components/forms/FormInput';
import ToggleSwitch from '@/components/forms/ToggleSwitch';
import { formatCPF, formatCEP, getNumericValue } from '../../utils/maskUtils';
import { jwtDecode } from 'jwt-decode';

// Define JWT payload interface for type safety
interface JwtPayload {
  sub: number;
  cpf: string;
  role: string;
  organizationId: number;
}

// Define validation errors interface
interface ValidationErrors {
  name?: string;
  cpf?: string;
  email?: string;
  address?: string;
  cep?: string;
  numberAdress?: string;
}

/**
 * TeacherRegister Component
 * Handles the registration of new teachers in the system with form validation.
 * Implements input masking for CPF and CEP fields.
 */
const TeacherRegister = () => {
  const router = useRouter();
  
  // Form state management
  const [name, setName] = useState<string>('');
  const [cpf, setCpf] = useState<string>(''); // This will hold the masked CPF
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [cep, setCep] = useState<string>(''); // This will hold the masked CEP
  const [numberAdress, setNumberAdress] = useState<string>('');
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Teacher-specific fields
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('');
  const [hireDate, setHireDate] = useState<string>('');
  
  // Form submission and validation state
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  /**
   * Effect hook to retrieve organizationId from JWT token
   */
  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setOrganizationId(decoded.organizationId);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setError('Erro ao obter informações do usuário logado');
      }
    } else {
      setError('Usuário não está autenticado');
    }
  }, []);

  /**
   * Validates form fields and returns any validation errors
   */
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!getNumericValue(cpf)) newErrors.cpf = "CPF é obrigatório";
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    if (!address.trim()) newErrors.address = "Endereço é obrigatório";
    if (!getNumericValue(cep)) newErrors.cep = "CEP é obrigatório";
    if (!numberAdress.trim()) newErrors.numberAdress = "Número é obrigatório";
    
    // Email format validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email em formato inválido";
    }
    
    // CPF length validation
    if (getNumericValue(cpf) && getNumericValue(cpf).length !== 11) {
      newErrors.cpf = "CPF deve conter 11 dígitos";
    }
    
    // CEP length validation
    if (getNumericValue(cep) && getNumericValue(cep).length !== 8) {
      newErrors.cep = "CEP deve conter 8 dígitos";
    }
    
    return newErrors;
  };

  /**
   * Updates both CPF and password fields when CPF changes
   * CPF is stored with mask, but password gets numeric value only
   */
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedCpf = e.target.value; 
    setCpf(maskedCpf);
    
    // Set password to numeric-only CPF value
    const numericCpf = getNumericValue(maskedCpf);
    setPassword(numericCpf); 
    
    // Clear error if field is filled
    if (attemptedSubmit && getNumericValue(maskedCpf).trim()) {
      setErrors(prev => ({ ...prev, cpf: undefined }));
    }
  };

  /**
   * Handles form submission with validation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    // If there are validation errors, stop submission
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to the first error if needed
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setError('');

    try {
      // Extract numeric values for submission
      const numericCpf = getNumericValue(cpf);
      const numericCep = getNumericValue(cep);
      
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          cpf: numericCpf,         // Send numeric value only
          email,
          password: numericCpf,    // Password is same as numeric CPF
          role: 'PROFESSOR',
          address,
          cep: numericCep,         // Send numeric value only
          numberAdress,
          organizationId,
          isActive,
          registrationNumber,
          birthDate,
          specialization,
          hireDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Registro de professor falhou, tente novamente');
      }

      router.push('/users/teachers/');
    } catch (err: any) {
      setError(err.message);
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
                      <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                        <FormInput
                          label="Nome"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (attemptedSubmit && e.target.value.trim()) {
                              setErrors(prev => ({ ...prev, name: undefined }));
                            }
                          }}
                          placeholder="Digite o Nome"
                          required
                          error={errors.name}
                          attemptedSubmit={attemptedSubmit}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                        <FormInput
                          label="CPF"
                          value={cpf}
                          onChange={handleCpfChange}
                          placeholder="Digite o CPF"
                          required
                          error={errors.cpf}
                          attemptedSubmit={attemptedSubmit}
                          mask={formatCPF}
                          maxLength={14} // 14 characters with mask: 999.999.999-99
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                        <FormInput
                          label="CEP"
                          value={cep}
                          onChange={(e) => {
                            setCep(e.target.value);
                            if (attemptedSubmit && getNumericValue(e.target.value).trim()) {
                              setErrors(prev => ({ ...prev, cep: undefined }));
                            }
                          }}
                          placeholder="Digite o CEP"
                          required
                          error={errors.cep}
                          attemptedSubmit={attemptedSubmit}
                          mask={formatCEP}
                          maxLength={9} // 9 characters with mask: 99999-999
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                        <FormInput
                          label="Matrícula"
                          value={registrationNumber}
                          onChange={(e) => setRegistrationNumber(e.target.value)}
                          placeholder="Digite a Matrícula"
                        />
                      </div>

                      <div className="col-span-6 md:col-span-3 lg:col-span-1">
                        <FormInput
                          label="Data de Nascimento"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          type="date"
                        />
                      </div>
                    </div>

                    {/* Address and Contact Section */}
                    <div className="grid grid-cols-6 gap-6 mb-6">
                      <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                        <FormInput
                          label="Endereço"
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (attemptedSubmit && e.target.value.trim()) {
                              setErrors(prev => ({ ...prev, address: undefined }));
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
                          value={numberAdress}
                          onChange={(e) => {
                            setNumberAdress(e.target.value);
                            if (attemptedSubmit && e.target.value.trim()) {
                              setErrors(prev => ({ ...prev, numberAdress: undefined }));
                            }
                          }}
                          placeholder="Digite o Número"
                          required
                          error={errors.numberAdress}
                          attemptedSubmit={attemptedSubmit}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2">
                        <FormInput
                          label="Email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (attemptedSubmit && e.target.value.trim()) {
                              setErrors(prev => ({ ...prev, email: undefined }));
                            }
                          }}
                          type="email"
                          placeholder="Digite o Email"
                          required
                          error={errors.email}
                          attemptedSubmit={attemptedSubmit}
                        />
                      </div>
                    </div>

                    {/* Teacher-specific Information Section */}
                    <div className="grid grid-cols-6 gap-6 mb-6">
                      <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                        <FormInput
                          label="Especialização"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          placeholder="Ex: Matemática, Física"
                          maxLength={100}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                        <FormInput
                          label="Data de Contratação"
                          value={hireDate}
                          onChange={(e) => setHireDate(e.target.value)}
                          type="date"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-1 lg:col-span-1 flex items-end">
                        <ToggleSwitch
                          label="Ativo"
                          checked={isActive}
                          onChange={() => setIsActive(!isActive)}
                        />
                      </div>
                    </div>

                    {/* Submit Button Section */}
                    <div className="grid grid-cols-1 mt-6">
                      <button
                        type="submit"
                        className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white rounded-md"
                      >
                        Cadastrar Professor
                      </button>
                      {error && <p className="mt-2 text-red-500">{error}</p>}
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