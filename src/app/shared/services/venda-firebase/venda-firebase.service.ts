import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "@angular/fire/compat/firestore";
import { from, map, Observable, switchMap } from 'rxjs';
import { Venda } from '../../model/Venda';

@Injectable({
  providedIn: 'root'
})
export class VendaFirebaseService {

  private injetor = inject(Injector);
  private collectionVenda: AngularFirestoreCollection<Venda>;
  VENDA_COLLECTION = 'vendas';

  constructor(private firestore: AngularFirestore) {
    this.collectionVenda = this.firestore.collection(this.VENDA_COLLECTION);
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

  cadastrar(venda: Venda): Observable<Venda> {
    venda.createdAt = new Date();
    delete venda.id;
    return from(this.collectionVenda.add({ ...venda })).pipe(
      switchMap((docRef: DocumentReference<Venda>) => docRef.get()),
      map(doc => ({ id: doc.id, ...doc.data() } as Venda))
    );
  }

  listarPorCaixa(caixaId: string): Observable<Venda[]> {
    return runInInjectionContext(this.injetor, () => {
      return from(
        this.collectionVenda.ref.where('caixaId', '==', caixaId).orderBy('createdAt', 'desc').get()
      ).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: this.convertFirestoreDate(data.createdAt),
              } as Venda;
            });
          } else {
            return [];
          }
        })
      );
    });
  }

  pesquisarPorId(id: string): Observable<Venda> {
    return runInInjectionContext(this.injetor, () => {
      return this.collectionVenda.doc(id).get().pipe(
        map(doc => {
          if (doc.exists) {
            const data = doc.data() as Venda;
            return {
              id: doc.id,
              ...data,
              createdAt: this.convertFirestoreDate(data.createdAt),
            } as Venda;
          } else {
            throw new Error('Venda not found');
          }
        })
      );
    });
  }
}
