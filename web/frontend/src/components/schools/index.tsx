import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useSchools } from '@/hooks/useSchools';

import { PageHeader } from '@/components/common/PageHeaderCoordinator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SearchBar } from '@/components/common/SearchBar';
import { SchoolsTable } from './SchoolsTable';
import { Pagination } from '@/components/common/Pagination';

const ITEMS_PER_PAGE = 10;

export default function SchoolsList() {
  const router = useRouter();
  const { schools: allSchools = [], isLoading, error } = useSchools();

  // Estado para busca e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'name' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtragem e ordenação de escolas
  const filteredSchools = useMemo(() => {
    let results = [...allSchools];
    if (searchTerm) {
      results = results.filter((school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (sortBy) {
      results.sort((a, b) => {
        const valA =
          sortBy === 'id' ? +a[sortBy] : String(a[sortBy]).toLowerCase();
        const valB =
          sortBy === 'id' ? +b[sortBy] : String(b[sortBy]).toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return results;
  }, [allSchools, searchTerm, sortBy, sortOrder]);

  //Resetar para a primeira página quando o filtro muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Cálculos para paginação
  const totalItems = filteredSchools.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Obter apenas as escolas para a página atual
  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSchools.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSchools, currentPage]);

  // Handlers
  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleRegisterClick() {
    router.push('/schools/register');
  }

  function handleEditRegion(schoolId: number) {
    router.push(`/schools/update?schoolId=${schoolId}`);
  }

  function handleSort(field: string) {
    if (field === 'id' || field === 'name') {
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field as 'id' | 'name');
        setSortOrder('asc');
      }
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Escolas', active: true },
  ];

  return (
    <section className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        {/* Header */}
        <PageHeader
          title="Escolas"
          buttonLabel="Cadastrar"
          onButtonClick={handleRegisterClick}
        />

        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4" aria-live="polite">
            <p>Carregando escolas...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-4 text-red-500" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Content area */}
        {!isLoading && !error && (
          <>
            <SearchBar
              placeholder="Pesquisar escolas..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <SchoolsTable
              schools={paginatedSchools}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onEdit={handleEditRegion}
              formatDate={formatDate}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  );
}
