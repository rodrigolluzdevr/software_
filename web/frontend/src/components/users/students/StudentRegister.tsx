import ToggleActive from '@/components/toggleActive/ToggleActive';
import { useState, useEffect } from 'react';

// Define interfaces for the data types
interface Region {
  id: number;
  name: string;
}

interface School {
  id: number;
  name: string;
}

interface Class {
  id: number;
  name: string;
}

const StudentRegister = () => {
  const [name, setName] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [cep, setCep] = useState<string>('');
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState<string>('');
  const [numberAdress, setNumberAdress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  
  // States for select options
  const [regions, setRegions] = useState<Region[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  
  // Loading states
  const [loading, setLoading] = useState({
    regions: false,
    schools: false,
    classes: false
  });

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(prev => ({ ...prev, regions: true }));
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/regions');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API did not return JSON");
        }
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
        setRegions([]); // Set empty array on error
      } finally {
        setLoading(prev => ({ ...prev, regions: false }));
      }
    };

    fetchRegions();
  }, []);

  // Fetch schools when a region is selected
  useEffect(() => {
    if (!selectedRegion) return;
    
    const fetchSchools = async () => {
      setLoading(prev => ({ ...prev, schools: true }));
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/schools?regionId=${selectedRegion}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API did not return JSON");
        }
        const data = await response.json();
        setSchools(data);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setSchools([]); // Set empty array on error
      } finally {
        setLoading(prev => ({ ...prev, schools: false }));
      }
    };

    fetchSchools();
  }, [selectedRegion]);

  // Fetch classes when a school is selected
  useEffect(() => {
    if (!selectedSchool) return;
    
    const fetchClasses = async () => {
      setLoading(prev => ({ ...prev, classes: true }));
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/classes?schoolId=${selectedSchool}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API did not return JSON");
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setClasses([]); // Set empty array on error
      } finally {
        setLoading(prev => ({ ...prev, classes: false }));
      }
    };

    fetchClasses();
  }, [selectedSchool]);

  // Toggle handler for isActive state
  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log({
      name,
      cpf,
      cep,
      registrationNumber,
      birthDate,
      address,
      numberAdress,
      email,
      isActive,
      regionId: selectedRegion,
      schoolId: selectedSchool,
      classId: selectedClass
    });
  };

  return (
    <div className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="py-4">
            <div className="shadow-sm rounded bg-white">
              <div className="p-5">
                <h5 className="text-lg font-semibold">Cadastro de Aluno</h5>
              </div>
              <div className="p-5 border-t border-gray-100">
                <form onSubmit={handleSubmit}>
                  {/* 1 line */}
                  <div className="grid grid-cols-6 gap-6 mb-6">
                    <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                      <label className="form-label font-semibold">Nome *</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o Nome"
                        name="name"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="form-label font-semibold">CPF *</label>
                      <input
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o CPF"
                        name="cpf"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="form-label font-semibold">CEP *</label>
                      <input
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o CEP"
                        name="cep"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="form-label font-semibold">
                        Matrícula
                      </label>
                      <input
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite a Matrícula"
                        name="registrationNumber"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-3 lg:col-span-1">
                      <label className="form-label font-semibold">
                        Data de Nascimento *
                      </label>
                      <input
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        type="date"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder=""
                        name="birthDate"
                        required
                      />
                    </div>
                  </div>

                  {/* 2 line */}
                  <div className="grid grid-cols-6 gap-6 mb-6">
                    <div className="col-span-6 sm:col-span-2 lg:col-span-2">
                      <label className="form-label font-semibold">
                        Endereço *
                      </label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o Endereço"
                        name="address"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="form-label font-semibold">
                        Número *
                      </label>
                      <input
                        value={numberAdress}
                        onChange={(e) => setNumberAdress(e.target.value)}
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o Número"
                        name="numberAdress"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2">
                      <label className="form-label font-semibold">
                        Email *
                      </label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o Email"
                        name="email"
                        required
                      />
                    </div>
                    <ToggleActive />
                  </div>
                  
                  {/* 3 line */}
                  <div className="grid grid-cols-6 gap-6 mb-6">
                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="font-semibold">
                        Região
                      </label>
                      <select 
                        className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                      >
                        <option value="">Selecione uma região</option>
                        {loading.regions ? (
                          <option disabled>Carregando regiões...</option>
                        ) : (
                          regions.map(region => (
                            <option key={region.id} value={region.id}>{region.name}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="font-semibold">
                        Escola
                      </label>
                      <select 
                        className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0"
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        disabled={!selectedRegion || loading.schools}
                      >
                        <option value="">Selecione uma escola</option>
                        {loading.schools ? (
                          <option disabled>Carregando escolas...</option>
                        ) : (
                          schools.map(school => (
                            <option key={school.id} value={school.id}>{school.name}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="font-semibold">Turma</label>
                      <select 
                        className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        disabled={!selectedSchool || loading.classes}
                      >
                        <option value="">Selecione uma turma</option>
                        {loading.classes ? (
                          <option disabled>Carregando turmas...</option>
                        ) : (
                          classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="grid grid-cols-1 mt-6">
                    <button
                      type="submit"
                      className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white rounded-md"
                    >
                      Cadastrar Aluno
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
