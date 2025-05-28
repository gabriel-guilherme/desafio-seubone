import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './index.css';

export default function PecasVisualizacao() {
  const location = useLocation();
  const navigate = useNavigate();
  const pecas = location.state?.pecasSelecionadas || [];

  return (
    <div className="pecas-visualizacao">
      <button onClick={() => navigate(-1)}>&larr; Voltar</button>
      <h2>Modelo Americano</h2>
      <p>1 de abr. de 2023, 00:00 de FANATION</p>

      <div className="visualizacao-content">
        <table className="visualizacao-tabela">
          <thead>
            <tr>
              <th>Key</th>
              <th>Ordem de exibição</th>
            </tr>
          </thead>
          <tbody>
            {pecas.map((peca, i) => (
              <tr key={i}>
                <td>{`${peca.tipo_recorte}-${peca.posicao_recorte}-${peca.tipo_produto}-${peca.material}-${peca.cor_material}`.toLowerCase()}</td>
                <td>{peca.ordem_exibicao}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="visualizacao-imagem-stack">
          {pecas.map((peca, index) => (
            <img
              key={index}
              src={peca.url_imagem}
              alt={`Peça ${index}`}
              className="imagem-sobreposta"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
