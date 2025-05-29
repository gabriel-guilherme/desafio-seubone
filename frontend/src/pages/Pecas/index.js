// Pecas.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './index.css';
import { getGroupRecortes, getRecortes } from "../../services/recortesService";
import PecasControls from "../../components/PecasControls";

export default function Pecas() {
  const [filteredData, setFilteredData] = useState([]);
  const [pecasDataForControls, setPecasDataForControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDataForControls = async () => {
      try {
        const data = await getRecortes();
        setPecasDataForControls(data);
      } catch (err) {
        console.error('Erro ao carregar dados para controles:', err);
      }
    };
    loadDataForControls();
  }, []);

  useEffect(() => {
    const loadPecas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getGroupRecortes(page, filter);

        if (response && response.data && response.pagination && typeof response.pagination.pages !== 'undefined') {
          setFilteredData(response.data);
          setTotalPages(response.pagination.pages);
        } else {
          console.error('Estrutura da resposta da API para getGroupRecortes inesperada:', response);
          setFilteredData([]);
          setTotalPages(0);
          setError('Não foi possível obter os dados das peças no formato esperado.');
        }

      } catch (err) {
        console.error('Erro ao carregar peças:', err);
        setError('Não foi possível carregar as peças. Tente novamente mais tarde.');
        setFilteredData([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    loadPecas();
  }, [page, filter]);

  const onTabChange = (tabName) => {
    setPage(1);
    if (tabName === 'ativos') {
      setFilter(1);
    } else if (tabName === 'expirados') {
      setFilter(2);
    } else {
      setFilter('');
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  let content;
  if (loading) {
    content = <div className="status-message">Carregando peças...</div>;
  } else if (error) {
    content = <div className="status-message error-message">{error}</div>;
  } else if (filteredData.length === 0) {
    content = <div className="status-message">Nenhuma peça encontrada para os critérios selecionados.</div>;
  } else {
    content = (
      <div className="pecas-table-container">
        <table>
          <thead className="pecas-table-header">
            <tr>
              <th>Título</th>
              <th>SKU</th>
              <th>Tipo</th>
              <th>Ordem de exibição</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(peca => (
              <tr key={peca.id} onClick={() => navigate(`/pecas/${peca.id}`)}>
                <td>{`${peca.tipo_recorte}-${peca.posicao_recorte}-${peca.tipo_produto}-${peca.material}-${peca.cor_material}`.toLowerCase()}</td>
                <td>{peca.sku}</td>
                <td>{peca.tipo_produto}</td>
                <td>{peca.ordem_exibicao}</td>
                <td>
                  <span className={`status-pill ${peca.status === 1 ? 'ativo' : 'expirado'}`}>
                    {peca.status === 1 ? 'Ativo' : 'Expirado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="pecas-page">
      <div className="pecas-header">
        <h1>Peças gerais</h1>
        <Link to={"/pecas/add"} className="add-peca-button">Adicionar peça</Link>
      </div>
      <div className="pecas-content">
        <PecasControls pecasData={pecasDataForControls} onTabChange={onTabChange} />

        {content}

        {!loading && !error && totalPages > 0 && filteredData.length > 0 && (
          <div className="pagination-controls">
            <button 
              onClick={handlePreviousPage} 
              disabled={page === 1 || loading}
            >
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={page === totalPages || loading}
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}