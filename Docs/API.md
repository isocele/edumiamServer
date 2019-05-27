# API
### Ici vous trouverez toutes les informations relative aux APIs du serveur Edumiam.

###### Les APIs sont séparées en 2 catégories pour le moment celles pour mettant à jour le profil de l'utilisateur (Hubspot) et celle pour les Notifications (SpreadSheet)

Toutes les routes ont pour URL : `<address>:8080/api` 

## Profil

#### Création du profil

**URL** :  `/user`

**Method** : `GET`

**Auth required** : `NO`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
    "firstname": "[prénom]",
    "last_name": "[nom de famille]"
}
```

**Exemple de requéte**

    localhost:8080/api/user?firstname=Hugo&lastname=Chollet
    
##En cas de succés :

```json
{
    "status": 200,
    "set_attributes": {
        "vid": "24751"
    }
}
```

`set_attributes` créant directement une variable `vid` dans Chatfuel 

##En cas d'échec :

```json
{
  "status": 405,
  "log": "Error in the request"
}
```
    
## Mise à jour du profil

**URL** :  `/user`

**Method** : `GET`

**Auth required** : `YES`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
    "firstname": "[prénom]",
    "vid": "[id renvoyé lors de la création du profil]",
    "email": "[email valide]"
}
```

**Exemple de requéte**

    localhost:8080/api/user?firstname=Hugo&vid=24651&email=ok@ok.com

    