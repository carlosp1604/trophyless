import { DomainException } from '../../Exception/Domain/DomainException.ts'

export class RelationshipDomainException extends DomainException{
  public static relationNotLoadedId = 'relationship_relation_not_loaded'
  public static cannotDeleteRelationId = 'relationship_cannot_delete_relation'
  public static cannotUpdateRelationId = 'relationship_cannot_update_relation'
  public static collectionNotLoadedId = 'relationship_collection_not_loaded'

  public static relationNotLoaded (): RelationshipDomainException {
    return new RelationshipDomainException(
      'Relation not loaded',
      this.relationNotLoadedId
    )
  }

  public static cannotDeleteRelation (): RelationshipDomainException {
    return new RelationshipDomainException(
      'Cannot delete relation',
      this.cannotDeleteRelationId
    )
  }

  public static cannotUpdateRelation (): RelationshipDomainException {
    return new RelationshipDomainException(
      'Cannot update relation',
      this.cannotUpdateRelationId
    )
  }

  public static collectionNotLoaded (): RelationshipDomainException {
    return new RelationshipDomainException(
      'Collection not loaded',
      this.collectionNotLoadedId
    )
  }
}