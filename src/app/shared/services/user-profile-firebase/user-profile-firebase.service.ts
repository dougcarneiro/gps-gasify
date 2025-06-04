import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "@angular/fire/compat/firestore";
import { from, map, Observable, of, switchMap } from 'rxjs';
import { UserProfile } from '../../model/UserProfile';
import { Operation } from '../../model/Operation';


@Injectable({
  providedIn: 'root'
})
export class UserProfileFirebaseService {

  private injetor = inject(Injector);

  private collectionUserProfile: AngularFirestoreCollection<UserProfile>;
  USER_PROFILE_COLLECTION = 'userProfile';

  constructor(
    private firestore: AngularFirestore,
  ) {
        this.collectionUserProfile = this.firestore.collection(this.USER_PROFILE_COLLECTION);
        runInInjectionContext(this.injetor, () => {
            this.collectionUserProfile = this.firestore.collection(this.USER_PROFILE_COLLECTION);
        });
    }

     listar(): Observable<UserProfile[]> {
        return runInInjectionContext(this.injetor, () => {
            return this.collectionUserProfile.valueChanges({idField: 'id'});
        });
    }

    obterOuCriar(userProfile: UserProfile): Observable<UserProfile> {
        return runInInjectionContext(this.injetor, () => {
            return this.pesquisarPorEmail(userProfile.email!).pipe(
                switchMap(existingProfile => {
                    if (existingProfile) {
                        return of(existingProfile);
                    } else {
                        return this.cadastrar(userProfile);
                    }
                })
            );
        });
    }

    cadastrar(userProfile: UserProfile): Observable<UserProfile> {
       userProfile.createdAt = new Date();
       userProfile.updatedAt = userProfile.createdAt;
        delete userProfile.id;
        return from(this.collectionUserProfile.add({...userProfile})).pipe(
            switchMap((docRef: DocumentReference<UserProfile>) => docRef.get()),
            map(doc => ({id: doc.id, ...doc.data()} as UserProfile))
        );
    }

    remover(id: string): Observable<any> {
        return runInInjectionContext(this.injetor, () => {
            return from(this.collectionUserProfile.doc(id).delete());
        });
    }

    pesquisarPorId(userProfileId: string): Observable<Operation> {
        return runInInjectionContext(this.injetor, () => {
            return this.collectionUserProfile.doc(userProfileId).get().pipe(
                map(doc => {
                    if (doc.exists) {
                        return { id: doc.id, ...doc.data() } as UserProfile;
                    } else {
                        throw new Error('UserProfile not found');
                    }
                })
            );
        });
    }

    pesquisarPorEmail(email: string): Observable<UserProfile | undefined> {
        return runInInjectionContext(this.injetor, () => {
            return from(
                this.collectionUserProfile.ref.where('email', '==', email).limit(1).get()
            ).pipe(
                map(snapshot => {
                    if (!snapshot.empty) {
                        const doc = snapshot.docs[0];
                        return { id: doc.id, ...doc.data() } as UserProfile;
                    } else {
                        return undefined;
                    }
                })
            );
        });
    }

    atualizar(userProfile: UserProfile): Observable<void> {
      userProfile.updatedAt = new Date();
        return runInInjectionContext(this.injetor, () => {
            return from(this.collectionUserProfile.doc(userProfile.id).update({...userProfile}));
        });
    }


}
