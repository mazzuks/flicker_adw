import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { DocumentUpload } from '../../components/DocumentUpload';
import { FileText, MessageSquare } from 'lucide-react';

const DOCUMENT_CATEGORIES = [
  {
    key: 'rg_socio_1',
    label: 'RG do Sócio Principal',
    description: 'Frente e verso em um único arquivo',
  },
  {
    key: 'cpf_socio_1',
    label: 'CPF do Sócio Principal',
    description: 'Documento do CPF',
  },
  {
    key: 'comprovante_residencia',
    label: 'Comprovante de Residência',
    description: 'Conta de luz, água ou telefone (últimos 3 meses)',
  },
  {
    key: 'comprovante_endereco_empresa',
    label: 'Comprovante de Endereço da Empresa',
    description: 'Contrato de aluguel ou IPTU',
  },
];

export function Documents() {
  const { currentClientId } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentClientId) {
      loadDocuments();
    }
  }, [currentClientId]);

  const updateDocumentStatus = async (docId: string, newStatus: string) => {
    const { error } = await supabase
      .from('documents')
      .update({ status: newStatus as any, updated_at: new Date().toISOString() })
      .eq('id', docId);

    if (!error) {
      loadDocuments();
    }
  };

  const loadDocuments = async () => {
    if (!currentClientId) return;

    const { data: docs } = await supabase
      .from('documents')
      .select('*')
      .eq('client_id', currentClientId)
      .order('created_at', { ascending: false });

    if (docs) {
      setDocuments(docs);

      const docIds = docs.map((d) => d.id);
      if (docIds.length > 0) {
        const { data: commentsData } = await supabase
          .from('document_comments')
          .select(
            `
            *,
            author:author_user_id (
              id,
              email,
              full_name
            )
          `
          )
          .in('document_id', docIds)
          .eq('visibility', 'CLIENT')
          .order('created_at', { ascending: false });

        if (commentsData) {
          const commentsByDoc: Record<string, any[]> = {};
          commentsData.forEach((comment) => {
            if (!commentsByDoc[comment.document_id]) {
              commentsByDoc[comment.document_id] = [];
            }
            commentsByDoc[comment.document_id].push(comment);
          });
          setComments(commentsByDoc);
        }
      }
    }

    setLoading(false);
  };

  const getDocumentByCategory = (category: string) => {
    return documents.find((d) => d.category === category);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingCount = documents.filter((d) => d.status === 'RECEIVED').length;
  const invalidCount = documents.filter((d) => d.status === 'INVALID').length;
  const approvedCount = documents.filter((d) => d.status === 'APPROVED').length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
        <p className="text-gray-600 mt-1">Envie os documentos necessários para análise</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Em análise</p>
          <p className="text-3xl font-bold text-blue-900 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium">Reenviar</p>
          <p className="text-3xl font-bold text-red-900 mt-1">{invalidCount}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Aprovados</p>
          <p className="text-3xl font-bold text-green-900 mt-1">{approvedCount}</p>
        </div>
      </div>

      {invalidCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium">
            Alguns documentos precisam ser reenviados. Verifique os comentários abaixo.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {DOCUMENT_CATEGORIES.map((category) => {
          const doc = getDocumentByCategory(category.key);
          const docComments = doc ? comments[doc.id] || [] : [];

          return (
            <div key={category.key}>
              <DocumentUpload
                category={category.key}
                label={category.label}
                description={category.description}
                existingDoc={doc}
                onUploadComplete={loadDocuments}
              />

              {docComments.length > 0 && (
                <div className="mt-2 ml-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Comentários da equipe</span>
                  </div>
                  <div className="space-y-2">
                    {docComments.map((comment) => (
                      <div key={comment.id} className="text-sm">
                        <p className="text-gray-700">{comment.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.created_at).toLocaleDateString('pt-BR')} às{' '}
                          {new Date(comment.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
