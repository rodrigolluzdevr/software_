import LogoutButton from "@/components/logoutButton/Logout.Button";
import Wrapper from "@/components/wrapper/Wrapper";
import Link from "next/link";

export default function Admin() {
  return (
    <Wrapper>
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <h5 className="text-lg font-semibold">Shop Cart</h5>

                    <ul className="tracking-[0.5px] inline-flex items-center sm:mt-0 mt-3">
                        <li className="inline-block capitalize text-[14px] font-bold duration-500 hover:text-indigo-600"><Link href="/">Techwind</Link></li>
                        <li className="inline-block text-base text-slate-950 mx-0.5 ltr:rotate-0 rtl:rotate-180"></li>
                        <li className="inline-block capitalize text-[14px] font-bold duration-500 hover:text-indigo-600"><Link href="/shop">Shop</Link></li>
                        <li className="inline-block text-base text-slate-950 mx-0.5 ltr:rotate-0 rtl:rotate-180"></li>
                        <li className="inline-block capitalize text-[14px] font-bold text-indigo-600" aria-current="page">Cart</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 mt-6">
                    <div className="relative overflow-x-auto shadow-sm rounded-md">
                        <table className="w-full text-start">
                            <thead className="text-sm uppercase bg-white">
                                <tr>
                                    <th scope="col" className="p-4 w-4"></th>
                                    <th scope="col" className="text-start p-4 min-w-[220px]">Product</th>
                                    <th scope="col" className="p-4 w-24 min-w-[100px]">Price</th>
                                    <th scope="col" className="p-4 w-56 min-w-[220px]">Qty</th>
                                    <th scope="col" className="p-4 w-24 min-w-[100px]">Total($)</th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
                        <div className="lg:col-span-9 md:order-1 order-3">
                            <Link href="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md me-2 mt-2">Shop Now</Link>
                            <Link href="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center rounded-md bg-indigo-600/5 hover:bg-indigo-600 border-indigo-600/10 hover:border-indigo-600 text-indigo-600 hover:text-white mt-2">Add to Cart</Link>
                        </div>

                        <div className="lg:col-span-3 md:order-2 order-1">
                            <ul className="list-none shadow-sm rounded-md bg-white">
                                <li className="flex justify-between p-4">
                                    <span className="font-semibold text-lg">Subtotal :</span>
                                    <span className="text-slate-400">$ 1500</span>
                                </li>
                                <li className="flex justify-between p-4 border-t border-gray-100">
                                    <span className="font-semibold text-lg">Taxes :</span>
                                    <span className="text-slate-400">$ 150</span>
                                </li>
                                <li className="flex justify-between font-semibold p-4 border-t border-gray-200">
                                    <span className="font-semibold text-lg">Total :</span>
                                    <span className="font-semibold">$ 1650</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Wrapper>
  );
}