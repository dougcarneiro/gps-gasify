import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "@angular/fire/compat/firestore";
import { from, map, Observable, switchMap } from 'rxjs';
import { Venda } from '../../model/Venda';
import firebase from 'firebase/compat/app';

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

    let date: Date;

    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    // Normalizar para o início do dia (00:00:00.000)
    date.setHours(0, 0, 0, 0);

    return date;
  }

  cadastrar(venda: Venda): Observable<Venda> {
    // Converter a data para Timestamp do Firebase
    venda.createdAt = firebase.firestore.Timestamp.fromDate(new Date()) as any;
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

  listarPorOperacao(operationId: string, fromDate?: Date, toDate?: Date): Observable<Venda[]> {
    return runInInjectionContext(this.injetor, () => {
      let query = this.collectionVenda.ref.where('operationId', '==', operationId);

      if (fromDate && toDate) {
        // Normalizar as datas para início e fim do dia
        const fromDateNormalized = new Date(fromDate);
        fromDateNormalized.setHours(0, 0, 0, 0);

        const toDateNormalized = new Date(toDate);
        toDateNormalized.setHours(23, 59, 59, 999);

        // Converter as datas para Timestamp do Firebase
        const fromTimestamp = firebase.firestore.Timestamp.fromDate(fromDateNormalized);
        const toTimestamp = firebase.firestore.Timestamp.fromDate(toDateNormalized);

        query = query.where('createdAt', '>=', fromTimestamp).where('createdAt', '<=', toTimestamp);
      }

      return from(query.orderBy('createdAt', 'desc').get()).pipe(
        map(snapshot => {
          if (!snapshot.empty) {
            const vendas = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: this.convertFirestoreDate(data.createdAt),
              } as Venda;
            });

            // Teste: fazer consulta sem filtro de data para comparar
            if (fromDate && toDate) {
              const queryWithoutDate = this.collectionVenda.ref.where('operationId', '==', operationId);
              from(queryWithoutDate.orderBy('createdAt', 'desc').get()).subscribe(testSnapshot => {
                testSnapshot.docs.forEach(doc => {
                  const testData = doc.data();
                });
              });
            }

            return vendas;
          } else {
            return [];
          }
        })
      );
    });
  }
}
