import { RelationshipDomainException } from './RelationshipDomainException.ts'

export class Relationship<T> {
  private instance: T | undefined | null

  /**  Indicate if the instance should be persisted/updated in the persistence layer */
  private dirty: boolean
  /**  Indicate if the instance should be removed from the persistence layer */
  private removed: boolean
  private oldInstance: T | undefined

  private constructor (
    instance: T | undefined,
    dirty: boolean,
    removed: boolean
  ) {
    this.instance = instance
    this.dirty = dirty
    this.removed = removed
    this.oldInstance = undefined
  }

  /**
     * Initialize the relationship
     * Used for relationships retrieved from the persistence layer
     * @param relatedObject Object to relate to
     */
  public static initializeRelation<T> (relatedObject: T): Relationship<T> {
    return new Relationship<T>(relatedObject, false, false)
  }

  /**
     * Create a new relationship
     * @param relatedObject Object to relate to
     */
  public static createRelation<T> (relatedObject: T): Relationship<T> {
    return new Relationship<T>(relatedObject, true, false)
  }

  /**
     * Create a not loaded relationship.
     * The instance wasn't retrieved from persistence layer
     */
  public static notLoaded<T> (): Relationship<T> {
    return new Relationship<T>(undefined, false, false)
  }

  /**
     * Delete current relationship.
     * Current relationship can be removed once
     */
  public removeRelationship (): void {
    if (this.instance === undefined) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    // Relation does not exist or was already removed
    if (this.instance === null) {
      throw RelationshipDomainException.cannotDeleteRelation()
    }

    this.oldInstance = this.instance
    this.removed = true
    this.instance = null
  }

  /**
     * Update a relationship.
     * Current relationship will be removed
     * @param relatedObject Object to relate to
     */
  public updateRelationship (relatedObject: T): void {
    if (this.instance === undefined) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    if (this.isRemoved()) {
      throw RelationshipDomainException.cannotUpdateRelation()
    }

    if (this.instance !== null) {
      this.removeRelationship()
    }

    this.instance = relatedObject
    this.dirty = true
  }

  get value (): T | null {
    if (this.instance === undefined) {
      throw RelationshipDomainException.relationNotLoaded()
    }

    return this.instance
  }

  public isRemoved (): boolean {
    return this.removed
  }

  public oldValue (): T | undefined {
    return this.oldInstance
  }

  public isDirty (): boolean {
    return this.dirty
  }
}