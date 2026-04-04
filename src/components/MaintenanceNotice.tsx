'use client'

import React from 'react'
import { AlertTriangle, Hammer, Clock } from 'lucide-react'

const MaintenanceNotice = () => {
  return (
    <div className="maintenance-overlay">
      <div className="maintenance-content">
        <div className="maintenance-icon-wrapper">
          <Hammer className="maintenance-icon" size={48} />
        </div>
        
        <h1 className="maintenance-title">Site em Manutenção</h1>
        
        <p className="maintenance-description">
          Estamos trabalhando para melhorar sua experiência. 
          O site do <strong>Grupo Bora Pro</strong> está passando por uma atualização técnica
          e algumas funcionalidades estarão indisponíveis temporariamente.
        </p>

        <div className="maintenance-status">
          <div className="status-item">
            <Clock size={20} className="status-icon" />
            <span>Previsão de retorno em breve</span>
          </div>
          <div className="status-item">
            <AlertTriangle size={20} className="status-icon status-warning" />
            <span>Funcionalidades limitadas</span>
          </div>
        </div>

        <div className="maintenance-footer">
          <p>Se precisar de atendimento urgente, entre em contato via WhatsApp:</p>
          <a 
            href="https://wa.me/5511997468489" 
            target="_blank" 
            rel="noopener noreferrer"
            className="maintenance-button"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

      <style jsx>{`
        .maintenance-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.5s ease-out;
        }

        .maintenance-content {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          max-width: 550px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }

        .maintenance-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(90deg, #e33537, #ffc847);
        }

        .maintenance-icon-wrapper {
          background: #fff5f5;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: #e33537;
        }

        .maintenance-title {
          font-size: 2rem;
          color: #1a1a1a;
          margin-bottom: 1rem;
          font-weight: 800;
        }

        .maintenance-description {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .maintenance-status {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          text-align: left;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #475569;
          font-weight: 500;
        }

        .status-icon {
          color: #e33537;
        }

        .status-warning {
          color: #f59e0b;
        }

        .maintenance-footer p {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .maintenance-button {
          display: inline-block;
          background: #e33537;
          color: white;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(227, 53, 55, 0.3);
        }

        .maintenance-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(227, 53, 55, 0.4);
          background: #cd2f31;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 480px) {
          .maintenance-content {
            padding: 2rem 1.5rem;
          }
          .maintenance-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default MaintenanceNotice
