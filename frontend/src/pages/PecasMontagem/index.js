import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './index.css';
import { getGroupRecortes, getRecortes } from "../../services/recortesService";
import PecasControls from "../../components/PecasControls";

export default function PecasMontagem() {
  const [filteredData, setFilteredData] = useState([]);
  const [pecasData, setPecasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const loadPecas = async () => {
      try {
        const data = await getRecortes();
        setPecasData(data);
      } catch (err) {
        console.error('Erro ao carregar peças:', err);
        setError('Não foi possível carregar as peças.');
      } finally {
        setLoading(false);
      }
    };
    loadPecas();
  }, [])

  useEffect(() => {
    const loadPecas = async () => {
      try {
        const filteredData = await getGroupRecortes(page, filter);
        setFilteredData(filteredData.data);
      } catch (err) {
        console.error('Erro ao carregar peças:', err);
        setError('Não foi possível carregar as peças.');
      }
    };
    loadPecas();
  }, [page, filter]);

  const onTabChange = (event) => {
    if (event === 'ativos') setFilter(1);
    else if (event === 'expirados') setFilter(2);
    else setFilter('');
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleGerarImagem = () => {
    const selecionadas = filteredData.filter(p => selectedIds.includes(p.id));

    
    //console.log(selecionadas)
    navigate("/visualizacao", { state: { pecasSelecionadas: selecionadas } });
  };

  if (loading) return <div>Carregando peças...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="pecas-page">
      <div className="pecas-header">
        <h2>Peças gerais</h2>
        <Link to="/pecas/add" className="btn-add">Adicionar peça</Link>
      </div>

      

      <div className="pecas-table-wrapper">
        <PecasControls pecasData={pecasData} onTabChange={onTabChange} />
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
                    onChange={() => toggleSelection(peca.id)}
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
          disabled={selectedIds.length === 0}
        >
          GERAR IMAGEM
        </button>
      </div>
    </div>
  );
}
