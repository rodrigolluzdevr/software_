import { useRouter } from 'next/router';
import Link from 'next/link';
import { BiEdit } from 'react-icons/bi';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { regions } from '@/hooks/useRegions';
import { useState, useEffect, useMemo } from 'react';

interface Region {
  id: number;
  name: string;
  createdAt?: string;
}

type SortField = 'id' | 'name';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

const RegionsList = () => {
  const router = useRouter();
  const { regions: allRegions = [], isLoading, error } = regions();

  // Estado para busca e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortDirection>('asc');

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);

  // Filtragem e ordenação de regiões
  const filteredRegions = useMemo(() => {
    // Primeiro filtrar por termo de busca
    let results = [...allRegions];

    if (searchTerm) {
      results = results.filter((region) =>
        region.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Depois ordenar os resultados
    if (sortBy) {
      results.sort((a, b) => {
        const valA =
          sortBy === 'id' ? Number(a[sortBy]) : a[sortBy].toLowerCase();
        const valB =
          sortBy === 'id' ? Number(b[sortBy]) : b[sortBy].toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return results;
  }, [allRegions, searchTerm, sortBy, sortOrder]);

  // Resetar para a primeira página quando o filtro muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Cálculos para paginação
  const totalItems = filteredRegions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Obter apenas as regiões para a página atual
  const paginatedRegions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredRegions.slice(startIndex, endIndex);
  }, [filteredRegions, currentPage]);

  // Navegar entre páginas
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRegisterClick = () => {
    router.push('/regions/register');
  };

  const handleEditRegion = (regionId: string | number) => {
    router.push(`/regions/update/${regionId}`);
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Gerar array de páginas a serem exibidas (limitando o número de botões)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Se tiver poucas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Lógica para mostrar páginas relevantes quando houver muitas
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <section className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="py-4">
            {/* Header */}
            <header className="flex flex-row justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">Regiões</h1>

              <button
                onClick={handleRegisterClick}
                className="py-1 px-4 font-semibold tracking-wide border rounded-md 
                         bg-blue-500 hover:bg-white border-blue-500 hover:border-blue-500 
                         text-white hover:text-blue-500 transition-colors"
                aria-label="Cadastrar nova região"
              >
                Cadastrar
              </button>
            </header>

            {/* Breadcrumbs */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ul className="flex items-center text-[14px] font-bold">
                <li className="hover:text-blue-500 transition-colors">
                  <Link href="/">Inicio</Link>
                </li>
                <li className="mx-2" aria-hidden="true">
                  /
                </li>
                <li className="text-blue-500" aria-current="page">
                  Regiões
                </li>
              </ul>
            </nav>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-4" aria-live="polite">
                <p>Carregando regiões...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-4 text-red-500" role="alert">
                <p>{error}</p>
              </div>
            )}

            {/* Search Bar */}
            {!isLoading && !error && (
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar regiões..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleSearchChange}
                    value={searchTerm}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Regions Table */}
            {!isLoading && !error && (
              <>
                <div className="overflow-hidden rounded-md shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-light">
                      <thead className="text-xs md:text-sm uppercase bg-white">
                        <tr>
                          <th
                            scope="col"
                            className="text-center p-2 md:p-4 w-4 hidden xl:table-cell"
                          >
                            <div className="inline-flex items-center">
                              ID
                              <button
                                onClick={() => handleSort('id')}
                                className="ml-1 focus:outline-none"
                              >
                                {sortBy === 'id' ? (
                                  sortOrder === 'asc' ? (
                                    '▲'
                                  ) : (
                                    '▼'
                                  )
                                ) : (
                                  <span className="text-gray-300">▼</span>
                                )}
                              </button>
                            </div>
                          </th>
                          <th scope="col" className="text-left p-2 md:p-4">
                            <div className="inline-flex items-center">
                              Regiões
                              <button
                                onClick={() => handleSort('name')}
                                className="ml-1 focus:outline-none"
                              >
                                {sortBy === 'name' ? (
                                  sortOrder === 'asc' ? (
                                    '▲'
                                  ) : (
                                    '▼'
                                  )
                                ) : (
                                  <span className="text-gray-300">▼</span>
                                )}
                              </button>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="text-center p-2 md:p-4 hidden lg:table-cell"
                          >
                            Data De Criação
                          </th>
                          <th
                            scope="col"
                            className="text-center p-2 md:p-4 w-10 md:w-20"
                          >
                            Editar
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRegions.length === 0 ? (
                          <tr className="bg-white">
                            <td colSpan={6} className="text-center p-4">
                              Nenhuma região encontrada
                            </td>
                          </tr>
                        ) : (
                          paginatedRegions.map((region) => (
                            <tr
                              key={region.id}
                              className="bg-white hover:bg-gray-50"
                            >
                              <td className="text-center p-2 md:p-4 hidden xl:table-cell">
                                {region.id}
                              </td>
                              <td className="p-2 md:p-4">{region.name}</td>
                              <td className="text-center p-2 md:p-4 hidden lg:table-cell">
                                {formatDate(region.createdAt)}
                              </td>
                              <td className="text-center p-2 md:p-4">
                                <button
                                  onClick={() => handleEditRegion(region.id)}
                                  className="text-black hover:text-blue-500 transition-colors"
                                  aria-label={`Editar região ${region.name}`}
                                >
                                  <BiEdit className="text-xl md:text-2xl" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6">
                    <nav
                      aria-label="Paginação de regiões"
                      className="flex items-center space-x-1"
                    >
                      {/* Botão anterior */}
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-label="Página anterior"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>

                      {/* Números das páginas */}
                      {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-gray-400"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${page}`}
                            onClick={() => goToPage(Number(page))}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            aria-label={`Ir para página ${page}`}
                            aria-current={
                              currentPage === page ? 'page' : undefined
                            }
                          >
                            {page}
                          </button>
                        ),
                      )}

                      {/* Botão próximo */}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-label="Próxima página"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                )}

                {/* Resumo da paginação */}
                <div className="text-center text-sm text-gray-500 mt-2">
                  Mostrando {paginatedRegions.length} de {totalItems} registros
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegionsList;
