import React from 'react';
import { Printer, X, CheckCircle, Leaf } from 'lucide-react';
import { formatRupiah, formatWeight, formatDateTime } from '../utils/formatters';

export default function ReceiptModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Struk Bukti Transaksi Penyetoran</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Struk (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="printable-area p-6 sm:p-8 overflow-y-auto flex-1 font-mono text-slate-800 text-xs sm:text-sm">
          {/* Header */}
          <div className="text-center pb-5 border-b-2 border-dashed border-slate-300">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-lg font-bold font-sans tracking-tight text-slate-900">
                SAMPAHPAY RECYCLING NETWORK
              </h2>
            </div>
            <p className="text-slate-500 font-sans text-xs">
              Sistem Administrasi Bank Sampah & Jaringan Daur Ulang Modern
            </p>
            <p className="text-slate-500 font-sans text-xs">
              Jl. Pelita Harapan Indah No. 108, Jakarta Selatan • Hotline: 0811-4455-667
            </p>
            <div className="mt-3 inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-sans font-bold text-xs uppercase tracking-wider">
              BUKTI PENERIMAAN SAMPAH
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-dashed border-slate-300 text-xs font-sans">
            <div>
              <span className="text-slate-500 block">No. Transaksi:</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{transaction.id}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Waktu Transaksi:</span>
              <span className="font-medium text-slate-900">{formatDateTime(transaction.date || transaction.created_at)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Nama Nasabah:</span>
              <span className="font-bold text-slate-900">{transaction.customer_name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Petugas Kasir/Staff:</span>
              <span className="font-medium text-slate-900">{transaction.staff_name || 'Petugas'}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 text-[11px] uppercase tracking-wider font-sans">
                  <th className="py-2">Item Sampah</th>
                  <th className="py-2 text-right">Berat</th>
                  <th className="py-2 text-right">Harga/kg</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transaction.items &&
                  transaction.items.map((item, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-2">
                        <div className="font-semibold text-slate-900 font-sans">{item.waste_name}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{item.category_name}</div>
                      </td>
                      <td className="py-2 text-right font-medium">{formatWeight(item.weight)}</td>
                      <td className="py-2 text-right text-slate-600">{formatRupiah(item.price_per_kg)}</td>
                      <td className="py-2 text-right font-bold text-slate-900">{formatRupiah(item.subtotal)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-3 pb-4 border-t-2 border-slate-300 font-sans">
            <div className="flex justify-between items-center py-1 text-slate-600 text-xs">
              <span>Total Bobot Sampah Disetor:</span>
              <span className="font-bold font-mono text-sm text-slate-900">{formatWeight(transaction.total_weight)}</span>
            </div>
            <div className="flex justify-between items-center py-2 text-base font-bold text-slate-900 border-t border-slate-200 mt-1">
              <span>TOTAL DITERIMA NASABAH:</span>
              <span className="text-emerald-700 text-lg font-mono">{formatRupiah(transaction.total_amount)}</span>
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-sans text-slate-600 mb-4 border border-slate-200">
              <span className="font-bold text-slate-700">Catatan: </span>
              {transaction.notes}
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-dashed border-slate-300 font-sans">
            <p className="text-xs font-semibold text-emerald-800 mb-1">
              "Terima kasih telah berkontribusi memilah sampah untuk bumi yang lebih hijau!"
            </p>
            <p className="text-[11px] text-slate-400">
              Struk ini adalah bukti sah transaksi sistem daur ulang SampahPay • www.sampahpay.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

