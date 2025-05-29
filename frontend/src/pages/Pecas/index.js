// Pecas.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './index.css';
import { getGroupRecortes, getRecortes } from "../../services/recortesService";
import PecasControls from "../../components/PecasControls";

export default function Pecas() {
  /*const mockPecasData = [
    { id: 1, titulo: 'Aba-frente-americano-linho-azul_marinho', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 2, titulo: 'Aba-frente-americano-linho-azul_marinho', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 3, titulo: 'Aba-frente-americano-linho-azul_marinho', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 4, titulo: 'Aba-frente-americano-linho-azul_marinho', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 5, titulo: 'Aba-frente-americano-linho-azul_marinho', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 6, titulo: 'Aba-frente-americano-linho-azul_marinho', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 7, titulo: 'Aba-frente-americano-linho-azul_marinho', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 8, titulo: 'Modelo São Paulo', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 9, titulo: 'Modelo São Paulo', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
    { id: 10, titulo: 'Modelo São Paulo', sku: '#123', tipo: 'Americano', ordem: '05', status: 'Ativo' },
  ];*/

  const [filteredData, setFilteredData] = useState([]);
  const [pecasData, setPecasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

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
        //console.log(filter)
        const filteredData = await getGroupRecortes(page, filter)
        
        setFilteredData(filteredData.data);
      } catch (err) {
        console.error('Erro ao carregar peças:', err);
        setError('Não foi possível carregar as peças.'); 
      }
    };
    loadPecas();

  }, [page, filter]);


  const onTabChange = (event) => {
    if(event === 'ativos') {
      setFilter(1)
    }else if(event === 'expirados') {
      setFilter(2)
    }else {
      setFilter('')
    }
    
  }

  if (loading) {
    return <div>Carregando peças...</div>;
  }


  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pecas-page">
      <div className="pecas-header">
        <h1>Peças gerais</h1>
        <Link to={"/pecas/add"} className="add-peca-button">Adicionar peça</Link>
      </div>
      <div className="pecas-content">
        <PecasControls pecasData={pecasData} onTabChange={onTabChange}/>

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
      </div>
    </div>
  );
}