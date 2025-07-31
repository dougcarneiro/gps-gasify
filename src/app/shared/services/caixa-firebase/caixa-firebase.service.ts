import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "@angular/fire/compat/firestore";
import { from, map, Observable, switchMap } from 'rxjs';
import { Caixa } from '../../model/Caixa';


@Injectable({
  providedIn: 'root'
})
export class CaixaFirebaseService {

  private injetor = inject(Injector);

  private collectionCaixa: AngularFirestoreCollection<Caixa>;
  CAIXA_COLLECTION = 'register';

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.collectionCaixa = this.firestore.collection(this.CAIXA_COLLECTION);
    runInInjectionContext(this.injetor, () => {
      this.collectionCaixa = this.firestore.collection(this.CAIXA_COLLECTION);
    });
  }

  listar(): Observable<Caixa[]> {
    return runInInjectionContext(this.injetor, () => {
      return this.collectionCaixa.valueChanges({ idField: 'id' });
    });
  }

  cadastrar(caixa: Caixa): Observable<Caixa> {
    caixa.createdAt = new Date();
    caixa.updatedAt = caixa.createdAt;
    caixa.isActive = true; // Default value for isActive
    caixa.currentBalance = caixa.initialBalance; // Set current balance to initial balance
    delete caixa.id;
    return from(this.collectionCaixa.add({ ...caixa })).pipe(
      switchMap((docRef: DocumentReference<Caixa>) => docRef.get()),
      map(doc => ({ id: doc.id, ...doc.data() } as Caixa))
    );
  }

  remover(id: string): Observable<any> {
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionCaixa.doc(id).delete());
    });
  }

  pesquisarPorId(caixaId: string): Observable<Caixa> {
    return runInInjectionContext(this.injetor, () => {
      return this.collectionCaixa.doc(caixaId).get().pipe(
        map(doc => {
          if (doc.exists) {
            return { id: doc.id, ...doc.data() } as Caixa;
          } else {
            throw new Error('Caixa not found');
          }
        })
      );
    });
  }

  private convertFirestoreDate(timestamp: any): Date | undefined {
    if (!timestamp) return undefined;
    if (timestamp instanceof Date) return timestamp;
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return new Date(timestamp);
  }

  listarPorOperacao(operationId: string): Observable<Caixa[]> {
    return runInInjectionContext(this.injetor, () => {
      return from(
        this.collectionCaixa.ref.where('operationId', '==', operationId).get()
      ).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: this.convertFirestoreDate(data.createdAt),
                updatedAt: this.convertFirestoreDate(data.updatedAt),
                deletedAt: this.convertFirestoreDate(data.deletedAt)
              } as Caixa;
            });
          } else {
            return [];
          }
        })
      );
    });
  }

  listarAtivoPorOperacao(operationId: string): Observable<Caixa[]> {
    return runInInjectionContext(this.injetor, () => {
      return from(
        this.collectionCaixa.ref
          .where('operationId', '==', operationId)
          .where('isActive', '==', true)
          .get()
      ).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: this.convertFirestoreDate(data.createdAt),
                updatedAt: this.convertFirestoreDate(data.updatedAt),
                deletedAt: this.convertFirestoreDate(data.deletedAt)
              } as Caixa;
            });
          } else {
            return [];
          }
        })
      );
    });
  }

  listarPorOwner(ownerId: string): Observable<Caixa[]> {
    return runInInjectionContext(this.injetor, () => {
      return from(
        this.collectionCaixa.ref.where('ownerId', '==', ownerId).get()
      ).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Caixa));
          } else {
            return [];
          }
        })
      );
    });
  }

  listarAtivoPorOwnerEOperation(ownerId: string, operationId: string): Observable<Caixa[]> {
    return runInInjectionContext(this.injetor, () => {
      return from(
        this.collectionCaixa.ref
          .where('ownerId', '==', ownerId)
          .where('operationId', '==', operationId)
          .where('isActive', '==', true)
          .get()
      ).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Caixa));
          } else {
            return [];
          }
        })
      );
    });
  }

  atualizar(caixa: Caixa): Observable<void> {
    caixa.updatedAt = new Date();
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionCaixa.doc(caixa.id).update({ ...caixa }));
    });
  }

  fecharCaixa(id: string, closedBalance: number): Observable<void> {
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionCaixa.doc(id).update({
        closedBalance: closedBalance,
        isActive: false,
        updatedAt: new Date()
      }));
    });
  }

  atualizarSaldo(id: string, novoSaldo: number): Observable<void> {
    return runInInjectionContext(this.injetor, () => {
      return from(this.collectionCaixa.doc(id).update({
        currentBalance: novoSaldo,
        updatedAt: new Date()
      }));
    });
  }
}
