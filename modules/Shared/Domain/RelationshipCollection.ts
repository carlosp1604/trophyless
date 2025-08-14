/* eslint @typescript-eslint/no-empty-object-type: 0 */

import { Relationship } from './Relationship.ts'
import { RelationshipDomainException } from './RelationshipDomainException.ts'

export class RelationshipCollection<T extends {}, V extends {}> {
  private readonly instances: Map<V, Relationship<T>> | undefined

  private constructor (instances: Map<V, Relationship<T>> | undefined) {
    this.instances = instances
  }

  /**
     * Create an empty collection
     */
  public static initializeCollection<T extends {}, V extends {}> (): RelationshipCollection<T, V> {
    return new RelationshipCollection<T, V>(new Map<V, Relationship<T>>())
  }

  /**
     * Create a not loaded collection
     * The items weren't retrieved from persistence layer
     */
  public static notLoaded<T extends {}, V extends {}> (): RelationshipCollection<T, V> {
    return new RelationshipCollection<T, V>(undefined)
  }

  /**
     * Add a new item retrieved from persistence layer to the collection
     * @param relatedObject Object to relate with
     * @param objectIdentifier Object identifier
     */
  public createItem (
    relatedObject: T,
    objectIdentifier: V
  ): void {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    this.instances.set(objectIdentifier, Relationship.initializeRelation(relatedObject))
  }

  /**
     * Add a new item to the collection. If item already exists, is updated
     * @param relatedObject Object to relate with
     * @param objectIdentifier Object identifier
     */
  public addItem (
    relatedObject: T,
    objectIdentifier: V
  ): void {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    const itemExists = this.instances.get(objectIdentifier)

    if (itemExists) {
      itemExists.updateRelationship(relatedObject)
    } else {
      this.instances.set(objectIdentifier, Relationship.createRelation(relatedObject))
    }
  }

  /**
     * Remove a collection item given its identifier
     * @param objectIdentifier Object identifier
     * @return true if removed or false
     */
  public removeItem (objectIdentifier: V): boolean {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    const itemToDelete = this.instances.get(objectIdentifier)

    if (itemToDelete) {
      itemToDelete.removeRelationship()
      this.instances.set(objectIdentifier, itemToDelete)

      return true
    }

    return false
  }

  /**
     * Find an item given its identifier
     * @param objectIdentifier Object identifier
     * @return Item if found or null
     */
  public getItem (objectIdentifier: V): T | null {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    const item = this.instances.get(objectIdentifier)

    if (!item) {
      return null
    }

    return item.value
  }

  get dirtyValues (): Array<T> {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }
    const values: Array<T> = []

    this.instances.forEach((value) => {
      if (value.isDirty() && value.value) {
        values.push(value.value)
      }
    })

    return values
  }

  get removedValues (): Array<T> {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    const values: Array<T> = []

    this.instances.forEach((value) => {
      if (value.isRemoved()) {
        const oldValue = value.oldValue()

        if (oldValue !== undefined) {
          values.push(oldValue)
        }
      }
    })

    return values
  }

  get values (): Array<T> {
    if (this.instances === undefined) {
      throw RelationshipDomainException.collectionNotLoaded()
    }

    const values: Array<T> = []

    this.instances.forEach((value) => {
      if (value.value !== null) {
        values.push(value.value)
      }
    })

    return values
  }
}

