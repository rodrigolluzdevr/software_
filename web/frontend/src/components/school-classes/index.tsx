import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useClasses } from '@/hooks/useClasses';

import { PageHeader } from '@/components/common/PageHeaderDirector';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SearchBar } from '@/components/common/SearchBar';
import { ClassesTable } from './ClassesTable';
import { Pagination } from '@/components/common/Pagination';

const ITEMS_PER_PAGE = 10;

export default function ClassesList() {
  const router = useRouter();
  const { classes: allClasses = [], isLoading, error } = useClasses();

  // Estado para busca e ordenação
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'name' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtragem e ordenação de turmas
  const filteredClasses = useMemo(() => {
    let results = [...allClasses];
    if (searchTerm) {
      results = results.filter((schoolclass) =>
        schoolclass.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
  }, [allClasses, searchTerm, sortBy, sortOrder]);

  //Resetar para a primeira página quando o filtro muda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Cálculos para paginação
  const totalItems = filteredClasses.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Obter apenas as turmas para a página atual
  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClasses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClasses, currentPage]);

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
    router.push('/school-classes/register');
  }

  function handleEditRegion(classId: number) {
    router.push(`/school-classes/update?classId=${classId}`);
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
    { label: 'Início', href: '/' },
    { label: 'Turmas', href: '/school-classes' },
  ];

  return (
    <section className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        {/* Header */}
        <PageHeader
          title="Turmas"
          buttonLabel="Cadastrar"
          onButtonClick={handleRegisterClick}
        />

        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4" aria-live="polite">
            <p>Carregando turmas...</p>
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
              placeholder="Pesquisar turmas..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <ClassesTable
              classes={paginatedClasses}
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
