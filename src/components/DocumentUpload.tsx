import { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface DocumentUploadProps {
  category: string;
  label: string;
  description?: string;
  existingDoc?: any;
  onUploadComplete?: () => void;
}

export function DocumentUpload({
  category,
  label,
  description,
  existingDoc,
  onUploadComplete,
}: DocumentUploadProps) {
  const { currentClientId, user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentClientId || !user) return;

    const file = e.target.files[0];
    setError('');
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentClientId}/${category}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('documents').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('documents').insert({
        client_id: currentClientId,
        category,
        filename: file.name,
        storage_path: fileName,
        file_size: file.size,
        mime_type: file.type,
        status: 'RECEIVED',
        uploaded_by: user.id,
      });

      if (dbError) throw dbError;

      if (onUploadComplete) onUploadComplete();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50';
      case 'INVALID':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5" />;
      case 'INVALID':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprovado';
      case 'INVALID':
        return 'Reenviar necessário';
      default:
        return 'Em análise';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{label}</h3>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        {existingDoc && (
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              existingDoc.status
            )}`}
          >
            {getStatusIcon(existingDoc.status)}
            <span>{getStatusLabel(existingDoc.status)}</span>
          </div>
        )}
      </div>

      {existingDoc ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{existingDoc.filename}</p>
              <p className="text-xs text-gray-500">
                Enviado em {new Date(existingDoc.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {existingDoc.status === 'INVALID' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium mb-2">
                Este documento precisa ser reenviado
              </p>
              <label className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Enviar novo documento</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            {uploading ? 'Enviando...' : 'Clique para enviar'}
          </span>
          <span className="text-xs text-gray-500 mt-1">PDF, JPG ou PNG</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </label>
      )}

      {error && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
