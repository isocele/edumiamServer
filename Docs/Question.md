## Question

##### Permet d'exporter les questions poser par un user sur chatfuel, sur un google sheets "Questions chatfuel" sur le drive. 

#### Affiche du contenus

**URL** :  `/question`

**Method** : `GET`

**Auth required** : `NO`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
    "firstName": "[prénom]",
    "lastName": "[nom de famille]",
    "question": "[La question à sauvegarder]",
    "userID": "[Un chatfuel Id pour identifier rapidement le user]"
}
```

**Exemple de requéte**

    localhost:8080/api/question?firstName={{first name}}&lastName={{last name}}&question={{last user freeform input}}&userID={{chatfuel user id}}
    
#####Réponse en cas de succès :
```json
{
    "status": 200,
    "log": "Question envoyé au sheet"
}
```