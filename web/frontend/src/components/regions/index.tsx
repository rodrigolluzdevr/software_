import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useRegions } from '@/hooks/useRegions';

import { PageHeader } from '@/components/common/pageHeader';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SearchBar } from '@/components/common/SearchBar';
import { RegionsTable } from './RegionsTable';
import { Pagination } from '@/components/common/Pagination';

const ITEMS_PER_PAGE = 8;

const RegionsList = () => {
  const router = useRouter();
  const { regions: allRegions = [], isLoading, error } = useRegions();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRegions = useMemo(() => {
    let results = [...allRegions];

    if (searchTerm) {
      results = results.filter((region) =>
        region.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortBy) {
      results.sort((a, b) => {
        const valA = sortBy === 'id' ? Number(a[sortBy as keyof typeof a]) : String(a[sortBy as keyof typeof a]).toLowerCase();
        const valB = sortBy === 'id' ? Number(b[sortBy as keyof typeof b]) : String(b[sortBy as keyof typeof b]).toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return results;
  }, [allRegions, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalItems = filteredRegions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const paginatedRegions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredRegions.slice(startIndex, endIndex);
  }, [filteredRegions, currentPage]);

  function onPageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function onRegister() {
    router.push('/regions/register');
  }

  function onEditRegion(regionId: number) {
    router.push(`/regions/update/${regionId}`);
  }

  function onSort(field: string) {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field as 'id' | 'name');
      setSortOrder('asc');
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Regiões', active: true }
  ];

  return (
    <section className="w-full relative px-2 sm:px-3 md:px-4 lg:px-6">
      <div className="layout-specing">
        <div className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="py-4">
            <PageHeader 
              title="Regiões" 
              buttonLabel="Cadastrar" 
              onButtonClick={onRegister} 
            />

            <Breadcrumb items={breadcrumbItems} />

            {isLoading && (
              <div className="text-center py-4" aria-live="polite">
                <p>Carregando regiões...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-4 text-red-500" role="alert">
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && (
              <>
                <SearchBar
                  placeholder="Pesquisar regiões..."
                  value={searchTerm}
                  onChange={onSearch}
                />

                <RegionsTable
                  regions={paginatedRegions}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={onSort}
                  onEdit={onEditRegion}
                  formatDate={formatDate}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  isLoading={isLoading}
                />

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