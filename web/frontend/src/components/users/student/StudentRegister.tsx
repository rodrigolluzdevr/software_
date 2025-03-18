import { useState } from 'react';

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

  // Toggle handler for isActive state
  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <form className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="py-4">
            <div className="shadow-sm rounded bg-white">
              <div className="p-5">
                <h5 className="text-lg font-semibold">Cadastro de Aluno</h5>
              </div>
              <div className="p-5 border-t border-gray-100">
                <form>
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

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1 mt-2">
                      <label className="form-label font-semibold  flex items-center justify-center">Status do Aluno</label>
                      <div className="mt-3 flex items-center justify-center">
                        <div 
                          onClick={handleToggleActive}
                          className={`relative inline-flex flex-shrink-0 h-6 w-12 cursor-pointer transition-colors ease-in-out duration-200 border-2 border-transparent rounded-full focus:outline-none ${
                            isActive ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                          role="switch"
                          aria-checked={isActive}
                          tabIndex={0}
                        >
                          <span className="sr-only">Ativar aluno</span>
                          <span 
                            aria-hidden="true" 
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                              isActive ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                        <span className="ml-2 text-sm">
                          {isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 3 line */}
                  <div className="grid grid-cols-6 gap-6 mb-6">
                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="font-semibold">
                        Região
                      </label>
                      <select className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0">
                        <option value=""> </option>
                        <option value="Centro">Centro</option>
                        <option value="Rural">Rural</option>
                        <option value="Região 02">Região 02</option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="font-semibold">
                        Escola
                      </label>
                      <select className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0">
                        <option value=""> </option>
                        <option value="Escola Municipal">
                          Escola Municipal
                        </option>
                        <option value="Escola Estadual">Escola Estadual</option>
                        <option value="Escola Particular">
                          Escola Particular
                        </option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="font-semibold">Turma</label>
                      <select className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0">
                        <option value=""> </option>
                        <option value="2025 1º B">2025 1º B</option>
                        <option value="2025 2º B">2025 2º B</option>
                        <option value="2025 2º A">2025 2º A</option>
                      </select>
                    </div>
                    
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default StudentRegister;
