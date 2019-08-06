## Favoris

##### Gére les différentes actions possible avec les favoris: ajouter, supprimer et afficher. Les éléments favorisable sont des fiches sous forme de gallerie présent sur le google sheets "Favoris Usable" 

### Ajouter un favoris

**URL** :  `/favoris/new`

**Method** : `GET`

**Auth required** : `NO`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
  "vid": "[identifiant du contact Hubspot]",
  "push": "[id du favoris]"
}
```

**Exemple de requéte**

    localhost:8080/api/favoris/new?push=1&vid=44451

##### En cas de succès

```json
{
    "success": 200,
    "messages": [
        {
            "text": "Vous avez ajouté un nouveau favori !"
        }
    ]
}
```

##### En cas de mauvais vid

```json
{
    "status": 401,
    "log": "Error in the request: contact does not exist"
}
```

##### En cas de doublon

```json
{
    "success": 406,
    "messages": [
        {
            "text": "Vous avez déjà enregistré ce favori"
        }
    ]
}
```

### Supprimer un favoris

**URL** :  `/favoris/delete`

**Method** : `GET`

**Auth required** : `NO`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
  "vid": "[identifiant du contact Hubspot]",
  "push": "[id du favoris]"
}
```

**Exemple de requéte**

    http://localhost:8080/api/favoris/delete?vid=44451&push=1

##### En cas de succès

```json
{
    "success": 200,
    "messages": [
        {
            "text": "Favoris supprimé"
        }
    ]
}
```

##### En cas de favoris déjà supprimer où de mauvais id "push" de favoris
```json
{
    "success": 406,
    "messages": [
        {
            "text": "Vous n'avez pas enregistré ce favoris"
        }
    ]
}
```

### Afficher les favoris

**URL** :  `/favoris/draw`

**Method** : `GET`

**Auth required** : `NO`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
  "vid": "[identifiant du contact Hubspot]"
}
```

**Exemple de requéte**

    http://localhost:8080/api/favoris/draw?vid=44451

##### En cas d'1 favoris présent "1"

```json
{
    "messages": [
        {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Les 3 fiches recap 4-6  mois : Aliments, Quantités et Repas-type",
                            "image_url": "https://i.imgur.com/eb1wWJU.png",
                            "subtitle": "Tu peux enregistrer la fiche et la retrouver à tout moment dans tes favoris",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "title": "Fiches recap 4-6 mois",
                                    "url": "https://static1.squarespace.com/static/5ad8986c1aef1ddf0db431a3/t/5cac637f104c7b755efb152c/1554801536400/Fiche+recap_4-6mois.pdf"
                                },
                                {
                                    "type": "json_plugin_url",
                                    "title": "Supprimer le favori",
                                    "url": "http://52.14.42.174:8080/api/favoris/delete?vid={{vid}}&push=2"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ]
}
```

##### En cas de mauvais vid

```json
{
    "status": 401,
    "log": "Error in the request: contact does not exist"
}
```

#####  Si aucun favoris

```json
{
    "status": 401,
    "log": "Aucun favoris",
    "messages": [
        {
            "text": "Tu n'as pas encore de Favori ! Pour en ajouter appuis sur les boutons Favoris présents sur certaines fiches."
        }
    ]
}
```

##### En cas de limite de favoris atteinte

```json
{
    "success": 406,
    "messages": [
        {
            "text": "Vous avez déjà 10 favoris"
        }
    ]
}
```