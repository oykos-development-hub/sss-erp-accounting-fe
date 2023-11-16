import {SingularResponse} from './utils';

export interface PublicProcurementContractArticleOverageInsert {
  id: number;
  article_id: number | undefined;
  amount: number;
}

export interface PublicProcurementContractArticleOverageInsertResponse {
  publicProcurementContractArticleOverage_Insert: SingularResponse<PublicProcurementContractArticleOverageInsert>;
}

export interface PublicProcurementContractArticleOverageDeleteResponse {
  publicProcurementContractArticleOverage_Delete: SingularResponse<null>;
}
