import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "@angular/fire/compat/firestore";
import { from, map, Observable, switchMap } from 'rxjs';
import { Operation } from '../../model/Operation';
import { Produto } from '../../model/Produto';
import { ProdutoService } from '../produto/produto.service';


@Injectable({
  providedIn: 'root'
})
export class OperationFirebaseService {

  private injetor = inject(Injector);

  private collectionOperation: AngularFirestoreCollection<Operation>;
  OPERATION_COLLECTION = 'operation';


  constructor(
    private firestore: AngularFirestore,
  ) {
    this.collectionOperation = this.firestore.collection(this.OPERATION_COLLECTION);
    runInInjectionContext(this.injetor, () => {
      this.collectionOperation = this.firestore.collection(this.OPERATION_COLLECTION);
    });

  }

  listar(): Observable<Operation[]> {
    return runInInjectionContext(this.injetor, () => {
      return this.collectionOperation.valueChanges({ idField: 'id' });
    });
  }

  cadastrar(operation: Operation): Observable<Operation> {
    operation.createdAt = new Date();
    operation.updatedAt = operation.createdAt;
    delete operation.id;
    return from(this.collectionOperation.add({ ...operation })).pipe(
      switchMap((docRef: DocumentReference<Operation>) => docRef.get()),
      map(doc => ({ id: doc.id, ...doc.data() } as Operation))
    );
  }

  remover(id: string): Observable<any> {
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionOperation.doc(id).delete());
    });
  }

  pesquisarPorId(operationId: string): Observable<Operation> {
    return runInInjectionContext(this.injetor, () => {
      return this.collectionOperation.doc(operationId).get().pipe(
        map(document => {
          if (document.exists) {
            return { id: document.id, ...document.data() } as Operation;
          } else {
            throw new Error('Operation not found');
          }
        })
      );
    });
  }

  pesquisarPorSlug(slug: string): Observable<Operation | undefined> {
    return runInInjectionContext(this.injetor, () => {
      return from(
        this.collectionOperation.ref.where('slug', '==', slug).limit(1).get()
      ).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Operation;
          } else {
            return undefined;
          }
        })
      );
    });
  }

  atualizar(operation: Operation): Observable<void> {
    operation.updatedAt = new Date();
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionOperation.doc(operation.id).update({ ...operation }));
    });
  }
}
