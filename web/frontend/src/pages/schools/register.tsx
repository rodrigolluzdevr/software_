import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../utils/withAuth';
import Wrapper from '@/components/wrapper/Wrapper';
import FormInput from '@/components/forms/FormInput';
import ToggleSwitch from '@/components/forms/ToggleSwitch';
import { jwtDecode } from 'jwt-decode';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import FormSelect from '@/components/forms/FormSelect';

// Types
interface JwtPayload {
  sub: number;
  cpf: string;
  role: string;
  organizationId: number;
}

interface ValidationErrors {
  name?: string;
  regionId?: string;
}

interface Region {
  id: number;
  name: string;
}

interface SchoolFormData {
  name: string;
  regionId: number;
  isActive: boolean;
}

const SchoolRegister = () => {
  const router = useRouter();
  
  // Form data state
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    regionId: 0,
    isActive: true,
  });
  
  // Additional states
  const [regions, setRegions] = useState<Region[]>([]);
  const [organizationId, setOrganizationId] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Load organization ID from token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Usuário não está autenticado');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setOrganizationId(decoded.organizationId);
    } catch (error) {
      console.error('failed to decode token:', error);
      setError('erro ao obter informações do usuário logado');
    }
  }, []);

  // Load regions for dropdown
  useEffect(() => {
    if (!organizationId) return;

    const fetchRegions = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Usuário não está autenticado');
          return;
        }

        const response = await fetch('http://localhost:4000/regions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar regiões: ${response.status}`);
        }

        const regionsData = await response.json();
        setRegions(regionsData);
        
        // Set default region if available
        if (regionsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            regionId: regionsData[0].id
          }));
        }
      } catch (err: any) {
        console.error('Erro ao buscar regiões:', err);
        setError(err.message);
      }
    };

    fetchRegions();
  }, [organizationId]);

  // Field update handler
  const updateField = (field: keyof SchoolFormData, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Clear error for a field
  const clearError = (field: keyof ValidationErrors) => {
    if (attemptedSubmit && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Form validation
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    const { name, regionId } = formData;

    if (!name.trim()) newErrors.name = 'nome é obrigatório';
    if (!regionId) newErrors.regionId = 'região é obrigatória';

    return newErrors;
  };

  // Form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setError('');
    setLoading(true);

    try {
      const requestBody = {
        name: formData.name,
        regionId: formData.regionId,
        isActive: formData.isActive
      };

      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Usuário não está autenticado');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Falha no cadastro da escola, tente novamente';

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (error) {
          console.error('erro na resposta:', errorText);
        }
        throw new Error(errorMessage);
      }

      router.push('/schools/');
    } catch (err: any) {
      setError(err.message);
      console.error('erro durante o cadastro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Breadcrumb configuration
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Escolas', href: '/schools' },
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
                  <h5 className="text-lg font-semibold">Cadastrar Escola</h5>
                </div>
                <div className="p-5 border-t border-gray-100">
                  <Breadcrumb items={breadcrumbItems} />
                  <form onSubmit={handleSubmit}>
                    {/* School Info */}
                    <div className="grid grid-cols-6 gap-6 mb-6">
                      <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                        <FormInput
                          label="Nome da Escola"
                          value={formData.name}
                          onChange={(e) => {
                            updateField('name', e.target.value);
                            clearError('name');
                          }}
                          placeholder="Digite o nome da escola"
                          required
                          error={errors.name}
                          attemptedSubmit={attemptedSubmit}
                        />
                      </div>
                      
                      <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                        <FormSelect
                          label="Região"
                          value={formData.regionId.toString()}
                          onChange={(e) => {
                            updateField('regionId', parseInt(e.target.value));
                            clearError('regionId');
                          }}
                          options={regions.map(region => ({
                            value: region.id.toString(),
                            label: region.name
                          }))}
                          placeholder="Selecione uma região"
                          required
                          error={errors.regionId}
                          attemptedSubmit={attemptedSubmit}
                        />
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="grid grid-cols-6 gap-6 mb-6">
                      <div className="col-span-6 sm:col-span-1 lg:col-span-1 flex items-end">
                        <ToggleSwitch
                          label="Ativo"
                          checked={formData.isActive}
                          onChange={() =>
                            updateField('isActive', !formData.isActive)
                          }
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
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
                          {loading ? 'Cadastrando...' : 'Cadastrar'}
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

export default withAuth(SchoolRegister, ['SECRETARIO', 'COORDENADOR']);