import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "@angular/fire/compat/firestore";
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Operation } from '../../model/Operation';
import { Produto } from '../../model/Produto';


@Injectable({
  providedIn: 'root'
})
export class ProdutoFirebaseService {

  private injetor = inject(Injector);

  private collectionProduct: AngularFirestoreCollection<Produto>;
  PRODUCT_COLLECTION = 'product';

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.collectionProduct = this.firestore.collection(this.PRODUCT_COLLECTION);
    runInInjectionContext(this.injetor, () => {
      this.collectionProduct = this.firestore.collection(this.PRODUCT_COLLECTION);
    });
  }

  listar(): Observable<Produto[]> {
    return runInInjectionContext(this.injetor, () => {
      return this.collectionProduct.valueChanges({ idField: 'id' });
    });
  }

  cadastrar(produto: Produto): Observable<Produto> {
    produto.createdAt = new Date();
    produto.updatedAt = produto.createdAt;
    produto.status = true; // Default value for status
    delete produto.id;
    return from(this.collectionProduct.add({ ...produto })).pipe(
      switchMap((docRef: DocumentReference<Produto>) => docRef.get()),
      map(doc => ({ id: doc.id, ...doc.data() } as Produto))
    );
  }

  remover(id: string): Observable<any> {
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionProduct.doc(id).delete());
    });
  }

  pesquisarPorId(produtoId: string): Observable<Produto> {
    return runInInjectionContext(this.injetor, () => {
      return this.collectionProduct.doc(produtoId).get().pipe(
        map(doc => {
          if (doc.exists) {
            return { id: doc.id, ...doc.data() } as Produto;
          } else {
            throw new Error('Product not found');
          }
        })
      );
    });
  }

  pesquisarPorDescricao(descricao: string): Observable<Produto[]> {
    return runInInjectionContext(this.injetor, () => {
      return from(
        this.collectionProduct.ref.where('description', 'in', descricao).get()
      ).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Produto));
          } else {
            return [];
          }
        })
      );
    });
  }

  listarPorOperacao(operationId: string): Observable<Produto[]> {
    return runInInjectionContext(this.injetor, () => {
      return from(
        this.collectionProduct.ref.where('operationId', '==', operationId).get()
      ).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Produto));
          } else {
            return [];
          }
        })
      );
    });
  }

  atualizar(produto: Produto): Observable<void> {
    produto.updatedAt = new Date();
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionProduct.doc(produto.id).update({ ...produto }));
    });
  }

  atualizarEstoque(produtoId: string, novaQuantidade: number): Observable<void> {
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionProduct.doc(produtoId).update({
        quantidadeEstoque: novaQuantidade,
        updatedAt: new Date()
      }));
    });
  }
}
