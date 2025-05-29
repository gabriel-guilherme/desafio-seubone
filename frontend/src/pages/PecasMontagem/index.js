// PecasMontagem.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './index.css';
import { getGroupRecortes, getRecortes } from "../../services/recortesService";
import PecasControls from "../../components/PecasControls";

export default function PecasMontagem() {
  const [filteredData, setFilteredData] = useState([]);
  const [pecasDataForControls, setPecasDataForControls] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPecasObjects, setSelectedPecasObjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadAuxData = async () => {
      try {
        const data = await getRecortes();
        setPecasDataForControls(data);
      } catch (err) {
        console.error('Erro ao carregar dados auxiliares para montagem:', err);
      }
    };
    loadAuxData();
  }, []);

  useEffect(() => {
    const loadPecasDaPagina = async () => {
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
        console.error('Erro ao carregar peças para montagem:', err);
        setError('Não foi possível carregar as peças. Tente novamente mais tarde.');
        setFilteredData([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    loadPecasDaPagina();
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

  const toggleSelection = (peca) => {
    setSelectedIds(prevIds =>
      prevIds.includes(peca.id)
        ? prevIds.filter(id => id !== peca.id)
        : [...prevIds, peca.id]
    );
    setSelectedPecasObjects(prevPecas =>
      prevPecas.some(p => p.id === peca.id)
        ? prevPecas.filter(p => p.id !== peca.id)
        : [...prevPecas, peca]
    );
  };

  const handleGerarImagem = () => {
    navigate("/visualizacao", { state: { pecasSelecionadas: selectedPecasObjects } });
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
  
  let tableContent;
  if (loading) {
    tableContent = <div className="status-message">Carregando peças...</div>;
  } else if (error) {
    tableContent = <div className="status-message error-message">{error}</div>;
  } else {
    tableContent = (
      <>
        <table className="pecas-table">
          <thead>
            <tr>
              <th></th>
              <th>Key</th>
              <th>Tipo</th>
              <th>Ordem de exibição</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((peca) => (
              <tr
                key={peca.id}
                className={selectedIds.includes(peca.id) ? 'selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(peca.id)}
                    onChange={() => toggleSelection(peca)}
                  />
                </td>
                <td>{`${peca.tipo_recorte}-${peca.posicao_recorte}-${peca.tipo_produto}-${peca.material}-${peca.cor_material}`.toLowerCase()}</td>
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
        <button
          className="btn-gerar-img"
          onClick={handleGerarImagem}
          disabled={selectedPecasObjects.length === 0 || loading}
        >
          GERAR IMAGEM ({selectedPecasObjects.length})
        </button>
      </>
    );
  }

  return (
    <div className="pecas-page">
      <div className="pecas-header">
        <h2>Peças gerais para Montagem</h2>
        <Link to="/pecas/add" className="btn-add">Adicionar peça</Link>
      </div>
      
      <div className="pecas-table-wrapper">
        <PecasControls pecasData={pecasDataForControls} onTabChange={onTabChange} />
        
        {tableContent}

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