import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { useUsers } from '@/hooks/useUsers';

import { PageHeader } from '@/components/common/PageHeaderDirector';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SearchBar } from '@/components/common/SearchBar';

import { Pagination } from '@/components/common/Pagination';
import { StudentsTable } from './StudentsTable';

const ITEMS_PER_PAGE = 10;

export default function StudentsList() {
    const router = useRouter();
      const { users: allUsers = [], isLoading, error } = useUsers();
    
      // Filter users to only include those with ROLE="USER"
      const students = allUsers.filter((user) => user.role === 'USER');
    
      // Estado para busca e ordenação
      const [searchTerm, setSearchTerm] = useState('');
      const [sortBy, setSortBy] = useState<'id' | 'name' | 'email' | null>(null);
      const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
      const [currentPage, setCurrentPage] = useState(1);
    
      // Função para lidar com a ordenação
      const filteredStudents = useMemo(() => {
        let results = [...students];
        if (searchTerm) {
          results = results.filter(
            (student) =>
              student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.email.toLowerCase().includes(searchTerm.toLowerCase()),
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
      }, [allUsers, searchTerm, sortBy, sortOrder]);
    
      // Resetar para a primeira página quando o filtro muda
      useEffect(() => {
        setCurrentPage(1);
      }, [searchTerm]);
    
      // Cálculos para paginação
      const totalItems = filteredStudents.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
      // Obter apenas os estudantes para a página atual
      const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      }, [filteredStudents, currentPage]);
    
      
    
      // Handlers
      function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(e.target.value);
      }
    
      function handleRegisterClick() {
        router.push('/users/students/register');
      }
    
      function handleEditStudent(userId: string | number) {
        router.push(`/users/students/update/${userId}`);
      }
    
      function handleSort(field: string) {
        if (field === 'id' || field === 'name' || field === 'email') {
          if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
            setSortBy(field as 'id' | 'name' | 'email');
            setSortOrder('asc');
          }
        }
      }
    
      function formatDate(dateString?: string) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('pt-BR');
      }
    
      // Breadcrumb items
      const breadcrumbItems = [
        { label: 'Início', href: '/' },
        { label: 'Estudantes', active: true },
      ];
    
      return (
        <section className="w-full px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="layout-specing">
            {/* Header */}
            <PageHeader
              title="Estudantes"
              buttonLabel="Cadastrar"
              onButtonClick={handleRegisterClick}
            />
    
            {/* Breadcrumbs */}
            <Breadcrumb items={breadcrumbItems} />
    
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-4" aria-live="polite">
                <p>Carregando estudantes...</p>
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
                  placeholder="Pesquisar estudantes..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <StudentsTable
                  students={paginatedStudents}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onEdit={handleEditStudent}
                  formatDate={formatDate}
                />
    
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </section>
      );
    }