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
                <h5 className="text-lg font-semibold">Form Inputs</h5>
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-slate-800">
                <form>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="">
                      <label className="form-label font-semibold">
                        First Name:
                      </label>
                      <input
                        type="text"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0 mt-2"
                        placeholder="First Name:"
                        id="firstname"
                        name="name"
                      />
                    </div>

                    <div className="">
                      <label className="form-label font-semibold">
                        Username:
                      </label>
                      <div className="relative mt-2">
                        <span
                          className="absolute top-0.5 start-0.5 size-9 text-xl bg-gray-100 inline-flex justify-center items-center text-dark rounded"
                          id="basic-addon1"
                        >
                          <VscMention />
                        </span>
                        <input
                          type="text"
                          className="form-input ps-12 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0"
                          placeholder="Username"
                          required
                        />
                      </div>
                    </div>

                    <div className="">
                      <label className="form-label font-semibold">
                        Your Email:
                      </label>
                      <input
                        type="email"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0 mt-2"
                        placeholder="Email"
                        name="email"
                      />
                    </div>

                    <div className="">
                      <label className="font-semibold">Select Input:</label>
                      <select className="form-select form-input mt-2 w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0">
                        <option value="USA">USA</option>
                        <option value="CAD">Canada</option>
                        <option value="CHINA">China</option>
                      </select>
                    </div>

                    <div className="">
                      <label className="form-label font-semibold">
                        Number:
                      </label>
                      <input
                        type="number"
                        className="form-input w-full py-2 px-3 h-10 bg-transparent rounded outline-none border border-gray-200 focus:border-indigo-600 focus:ring-0 mt-2"
                        placeholder="Zip:"
                        id="zipcode"
                        name="number"
                      />
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
