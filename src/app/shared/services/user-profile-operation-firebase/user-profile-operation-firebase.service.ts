import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from "@angular/fire/compat/firestore";
import { from, map, Observable, switchMap, forkJoin, of, filter } from 'rxjs'; // Added filter
import { UserProfileOperation } from '../../model/UserProfileOperation';
import { UserProfile } from '../../model/UserProfile'; // Assuming UserProfile model path
import { OperationFirebaseService } from '../operation-firebase/operation-firebase.service';
import { UserProfileFirebaseService } from '../user-profile-firebase/user-profile-firebase.service';
import { Colaborador } from '../../model/Colaborador';


@Injectable({
  providedIn: 'root'
})
export class UserProfileOperationFirebaseService {

  private injetor = inject(Injector);

  private collectionUserProfileOperation: AngularFirestoreCollection<UserProfileOperation>;
  USER_PROFILE_OPERATION_COLLECTION = 'userProfileOperation';



  constructor(
    private firestore: AngularFirestore,
    private userProfileFirebaseService: UserProfileFirebaseService,
    private operationFirebaseService: OperationFirebaseService,
  ) {
        this.collectionUserProfileOperation = this.firestore.collection(this.USER_PROFILE_OPERATION_COLLECTION);
        runInInjectionContext(this.injetor, () => {
            this.collectionUserProfileOperation = this.firestore.collection(this.USER_PROFILE_OPERATION_COLLECTION);
        });
    }

    listar(): Observable<UserProfileOperation[]> {
        return runInInjectionContext(this.injetor, () => {
            return this.collectionUserProfileOperation.valueChanges({idField: 'id'});
        });
    }

    cadastrar(userProfileOperation: UserProfileOperation): Observable<UserProfileOperation> {
        userProfileOperation.createdAt = new Date();
        userProfileOperation.updatedAt = userProfileOperation.createdAt;
        delete userProfileOperation.id;
        return from(this.collectionUserProfileOperation.add({...userProfileOperation})).pipe(
            switchMap((docRef: DocumentReference<UserProfileOperation>) => docRef.get()),
            map(doc => ({id: doc.id, ...doc.data()} as UserProfileOperation))
        );
    }

    remover(id: string): Observable<any> {
        return runInInjectionContext(this.injetor, () => {
            return from(this.collectionUserProfileOperation.doc(id).delete());
        });
    }

    listarPorOperationId(operationId: string): Observable<UserProfileOperation[]> {
        return runInInjectionContext(this.injetor, () => {
            return this.firestore.collection<UserProfileOperation>(
                this.USER_PROFILE_OPERATION_COLLECTION,
                ref => ref.where('operationId', '==', operationId)
            ).valueChanges({ idField: 'id' });
        });
    }

    pesquisarPorOperationIdAndUserId(userProfileId: string, operationId: string): Observable<UserProfileOperation | undefined> {
        return runInInjectionContext(this.injetor, () => {
            return this.firestore.collection<UserProfileOperation>(
                this.USER_PROFILE_OPERATION_COLLECTION,
                ref => ref.where('userProfileId', '==', userProfileId).where('operationId', '==', operationId)
            ).get().pipe(
                map(snapshot => {
                    const doc = snapshot.docs[0];
                    return doc ? ({id: doc.id, ...doc.data() } as UserProfileOperation) : undefined;
                })
            );
        });
    }

    pesquisarPorId(id: string): Observable<UserProfileOperation | undefined> {
        return runInInjectionContext(this.injetor, () => {
            return this.firestore.collection<UserProfileOperation>(
                this.USER_PROFILE_OPERATION_COLLECTION
            ).doc(id).get().pipe( // Corrected to fetch a single document by ID using .doc(id).get()
                map(docSnapshot => {
                    if (docSnapshot.exists) {
                        // Explicitly cast data() to UserProfileOperation if necessary,
                        // or ensure your Firestore rules and data structure match the model.
                        const data = docSnapshot.data() as UserProfileOperation;
                        return {id: docSnapshot.id, ...data };
                    }
                    return undefined;
                })
            );
        });
    }

    verificarSeUserPodeCriar(roleId: string): Observable<UserProfileOperation | undefined> {
      return this.pesquisarPorId(roleId).pipe(
        map(operationRole => {
          if (operationRole && operationRole.isAdmin) {
            return operationRole;
          }
          return undefined;
        })
      );
    }

    // Deprecated: Use pesquisarPorEmailEOp instead
    pesquisarPorEmailEOp(email: string, operationSlug: string): Observable<UserProfileOperation | undefined> {
        return runInInjectionContext(this.injetor, () => {
            return this.firestore.collection<UserProfileOperation>(
                this.USER_PROFILE_OPERATION_COLLECTION,
                ref => ref.where('userEmail', '==', email).where('operationCode', '==', operationSlug)
            ).get().pipe(
                map(snapshot => {
                    const doc = snapshot.docs[0];
                    return doc ? ({id: doc.id, ...doc.data() } as UserProfileOperation) : undefined;
                })
            );
        });
    }

    atualizar(userProfileOperation: UserProfileOperation): Observable<void> {
        userProfileOperation.updatedAt = new Date();
        return runInInjectionContext(this.injetor, () => {
            return from(this.collectionUserProfileOperation.doc(userProfileOperation.id).update({...userProfileOperation}));
        });
    }

    buscarPorEmailEOperacao(email: string, operationSlug: string): Observable<UserProfileOperation | undefined> {
        return runInInjectionContext(this.injetor, () => {
            // Primeiro busca o perfil do usuário pelo email
            return this.userProfileFirebaseService.buscarPorEmail(email).pipe(
                switchMap(userProfile => {
                    if (!userProfile || !userProfile.id) { // Added null/undefined check for userProfile.id
                        return from([undefined]);
                    }

                    // Depois busca a operação pelo slug
                    return this.operationFirebaseService.pesquisarPorSlug(operationSlug).pipe(
                        switchMap(operation => {
                            if (!operation || !operation.id) {
                                return from([undefined]);
                            }

                            // Por fim, busca a relação entre o usuário e a operação
                            return this.pesquisarPorOperationIdAndUserId(userProfile.id!, operation.id);
                        })
                    );
                })
            );
        });
    }

    listarColaboradoresComDetalhes(operationId?: string): Observable<Colaborador[]> {
        return runInInjectionContext(this.injetor, () => {
            const sourceObservable = operationId ? this.listarPorOperationId(operationId) : this.listar();
            return sourceObservable.pipe(
                switchMap(userProfileOperations => {
                    if (!userProfileOperations || userProfileOperations.length === 0) {
                        return of([]);
                    }
                    const observables = userProfileOperations
                        .filter(upo => upo.userProfileId != null) // Ensure userProfileId is not null or undefined
                        .map(upo => {
                            return this.userProfileFirebaseService.pesquisarPorId(upo.userProfileId!) // Added non-null assertion operator
                            .pipe(
                                map((userProfile: UserProfile | undefined) => { // Explicitly type userProfile
                                    return {
                                        // UserProfile model does not have 'nome'. Email is available.
                                        id: upo.id, // Added id for reference
                                        nome: userProfile?.email, // Using email as name, adjust if a name field is added to UserProfile
                                        email: userProfile?.email,
                                        funcao: upo.function // Corrected to use 'function' field from UserProfileOperation
                                    };
                                })
                            );
                        });
                    return forkJoin(observables);
                })
            );
        });
    }

}
