import { useRouter } from 'next/router';
import { VscMention } from 'react-icons/vsc';

const StudentRegister = () => {
  const router = useRouter();

  return (
    <section className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
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
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o CEP"
                        name="text"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="form-label font-semibold">
                        Matrícula
                      </label>
                      <input
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite a Matrícula"
                        name="text"
                      />
                    </div>

                    <div className="col-span-6 md:col-span-3 lg:col-span-1">
                      <label className="form-label font-semibold">
                        Data de Nascimento *
                      </label>
                      <input
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
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o Número"
                        id="cpf"
                        name="cpf"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2">
                      <label className="form-label font-semibold">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-blue-500 focus:ring-0 mt-2"
                        placeholder="Digite o Email"
                        name="email"
                        required
                      />
                    </div>
                  </div>
                  {/* 3 line */}
                  <div className="grid grid-cols-6 gap-6 mb-6">
                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <label className="font-semibold">
                        Selecione a Região
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
                        Selecione a Escola
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
                      <label className="font-semibold">Selecione a Turma</label>
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
    </section>
  );
};

export default StudentRegister;
