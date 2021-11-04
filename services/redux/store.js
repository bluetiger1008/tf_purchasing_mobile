import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { reducer as formReducer } from 'redux-form'
import createSagaMiddleware from 'redux-saga'
import AsyncStorage from '@react-native-async-storage/async-storage'

import reducers from './reducers'
import rootSaga from './sagas'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: null,
  // stateReconciler: autoMergeLevel2,
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    ...reducers,
    form: formReducer,
  })
)

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
  // other store enhancers if any
)

const store = createStore(persistedReducer, enhancer)

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)
export { store, persistor }
