import { useUsers } from "@/hooks/useUsers";
import Link from "next/link";
import { useRouter } from "next/router";


export default function CoordinatorsList() {
    const router = useRouter();
    const { users: allUsers = [], isLoading, error } = useUsers();

    // Filter users to only include those with ROLE="COORDINATOR"
    const coordinators = allUsers.filter(user => user.role === "COORDINATOR");


    // Handlers
    const handleRegisterClick = () => {
        router.push('/users/coordinators/register');
    };

    const handleEditCoordinator = (userId: string | number) => {
        router.push(`/users/coordinators/update/${userId}`);
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <section className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
            <div className="layout-specing">
                <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
                    <div className="py-4">
                        {/* Header */}
                        <header className="flex flex-row justify-between items-center mb-4">
                            <h1 className="text-lg font-semibold">Lista De Coordenadores</h1>

                            <button
                                onClick={handleRegisterClick}
                                className="py-1 px-4 font-semibold tracking-wide border rounded-md 
                                        bg-blue-500 hover:bg-white border-blue-500 hover:border-blue-500 
                                        text-white hover:text-blue-500 transition-colors"
                                aria-label="Cadastrar novo coordenador"
                            >
                                Cadastrar
                            </button>
                        </header>

                        {/* Breadcrumbs */}
                        <nav className="mb-6" aria-label="Breadcrumb">
                            <ul className="flex items-center text-[14px] font-bold">
                                <li className="hover:text-blue-500 transition-colors">
                                    <Link href="/">Painel</Link>
                                </li>
                                <li className="mx-2" aria-hidden="true">/</li>
                                <li className="text-blue-500" aria-current="page">Coordenadores</li>
                            </ul>
                        </nav>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="text-center py-4" aria-live="polite">
                                <p>Carregando coordenadores...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="text-center py-4 text-red-500" role="alert">
                                <p>{error}</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );










}