import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../utils/withAuth';
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

interface SchoolData {
  id: number;
  name: string;
  regionId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SchoolUpdate = () => {
  const router = useRouter();
  const { id } = router.query;
  
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

  // Debug state
  const [debugInfo, setDebugInfo] = useState<string>('');

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

  // Load school data when component mounts and id is available
  useEffect(() => {
    if (!router.isReady) return;
    
    if (!id) {
      setDebugInfo('Nenhum ID encontrado na URL');
      return;
    }
    
    setDebugInfo(`ID encontrado: ${id}, buscando dados...`);
    
    const fetchSchoolData = async () => {
      setLoading(true);
      try {
        console.log(`Buscando dados para escola com id: ${id}`);
        
        // Get auth token
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error('Usuário não está autenticado');
        }
        
        // Fetch school data
        const response = await fetch(`http://localhost:4000/schools/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error (${response.status}):`, errorText);
          
          if (response.status === 401) {
            setError('Sessão expirada ou usuário sem permissão. Faça login novamente.');
          } else if (response.status === 404) {
            setError('Escola não encontrada');
          } else {
            setError(`Erro ao carregar dados (${response.status})`);
          }
          
          throw new Error(`Falha ao buscar dados da escola (${response.status})`);
        }
        
        const data: SchoolData = await response.json();
        console.log('Dados da escola recebidos:', data);
        setDebugInfo(`Dados carregados com sucesso para escola: ${data.name}`);
        
        // Map API data to our form structure
        setFormData({
          name: data.name || '',
          regionId: data.regionId || 0,
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
        });
      } catch (error) {
        console.error('Erro ao buscar dados da escola:', error);
        setDebugInfo(`Erro: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
        if (!(error instanceof Error && error.message.includes('401'))) {
          setError('Erro ao carregar dados da escola');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchoolData();
  }, [router.isReady, id]);

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

  // Active status change handler
  const handleActiveStatusChange = (newValue: boolean) => {
    const currentStatus = formData.isActive;
    console.log('Alterando status ativo de:', currentStatus, 'para:', newValue);
    
    setFormData(prevState => {
      const updatedData = {
        ...prevState,
        isActive: newValue,
      };
      
      console.log('Novo estado isActive após atualização:', updatedData.isActive);
      
      return updatedData;
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
    setDebugInfo(`Enviando atualização para escola id: ${id}...`);

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

      // Using PATCH to update school
      const response = await fetch(`http://localhost:4000/schools/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API update error (${response.status}):`, errorText);
        
        let errorMessage = 'Falha na atualização da escola, tente novamente';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Erro na resposta não é JSON:', errorText);
        }
        
        if (response.status === 401) {
          setError('Sessão expirada ou usuário sem permissão. Faça login novamente.');
        } else if (response.status === 403) {
          setError('Você não tem permissão para atualizar esta escola');
        } else if (response.status === 404) {
          setError('Escola não encontrada');
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
          console.log('API response (success):', responseData);
        }
      } catch (e) {
        console.error('Erro ao processar resposta:', e);
      }

      setDebugInfo('Atualização bem-sucedida, redirecionando...');
      router.push('/schools/');
    } catch (err: any) {
      setError(err.message);
      setDebugInfo(`Erro durante atualização: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Breadcrumb configuration
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Escolas', href: '/schools' },
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
                  <h5 className="text-lg font-semibold">Editar Escola</h5>
                </div>
                <div className="p-5 border-t border-gray-100">
                  {/* Breadcrumbs */}
                  <Breadcrumb items={breadcrumbItems} />

                  {loading && !error ? (
                    <div className="text-center py-8">
                      <p>Carregando dados da escola...</p>
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
                      {/* School Info */}
                      <div className="grid grid-cols-6 gap-6 mb-6">
                        <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                          <FormInput
                            label="Nome da Escola"
                            value={formData.name}
                            onChange={(e) => {
                              updateField('name', e.target.value);
                              if (attemptedSubmit && e.target.value.trim()) {
                                clearError('name');
                              }
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
                              if (attemptedSubmit) {
                                clearError('regionId');
                              }
                            }}
                            options={regions.map(region => ({
                              value: region.id.toString(),
                              label: region.name
                            }))}
                            required
                            error={errors.regionId}
                            attemptedSubmit={attemptedSubmit}
                          />
                        </div>
                      </div>

                      {/* Active Status */}
                      <div className="grid grid-cols-6 gap-6 mb-6">
                        <div className="col-span-6 sm:col-span-1 lg:col-span-1 flex items-end">
                          <div className="flex items-center">
                            <ToggleSwitch
                              label="Status"
                              checked={formData.isActive}
                              onChange={handleActiveStatusChange}
                            />
                            {process.env.NODE_ENV !== 'production' && (
                              <span className="ml-2 text-xs text-gray-500">
                                {formData.isActive ? 'Ativo' : 'Inativo'}
                              </span>
                            )}
                          </div>
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
                            {loading ? 'Salvando...' : 'Atualizar'}
                          </button>
                        </div>
                        {error && (
                          <p className="mt-2 text-red-500 text-center">{error}</p>
                        )}
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

export default withAuth(SchoolUpdate, ['SECRETARIO', 'COORDENADOR']);