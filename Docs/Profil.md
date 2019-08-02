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
        "vid": "44451"
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
    "vid": "[id renvoyé lors de la création du profil]",
}
```

**Données optionnel dans le query :**


```json
{
    "firstname": "[prénom]",
    "last_name": "[nom de famille]",
    "email": "[email]",
    "babybirth": "[date de naissance]",
    [...]
}
````

**Exemple de requéte**

    localhost:8080/api/user?firstname=Hugo&vid=24651

    localhost:8080/api/user?vid=44451&babybirth=01.09.2019&lastname=hugo&firstname=Chollet&Chatfuel_User_Id=89898&Gender=nope&Country=fr_FR&Source=m.metruc&Chatbot_status=intouchable&Chatbot_subscription=nope&City=ici

##En cas de succés :

```json
{
    "data": [
        {
            "property": "babybirth",
            "value": "01.09.2019"
        },
        {
            "property": "lastname",
            "value": "hugo"
        },
        {
            "property": "firstname",
            "value": "Chollet"
        },
        {
            "property": "Chatfuel_User_Id",
            "value": "89898"
        },
        {
            "property": "Gender",
            "value": "nope"
        },
        {
            "property": "Country",
            "value": "France"
        },
        {
            "property": "Source",
            "value": "Chatfuel :m.metruc"
        },
        {
            "property": "Chatbot_status",
            "value": "intouchable"
        },
        {
            "property": "Chatbot_subscription",
            "value": "nope"
        },
        {
            "property": "City",
            "value": "ici"
        },
        {
            "property": "Type",
            "value": "Chatbot user"
        }
    ]
}
````
