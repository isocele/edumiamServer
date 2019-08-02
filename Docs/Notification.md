## Notification

#### Recevoir sa notification

**URL** :  `/notif`

**Method** : `GET`

**Auth required** : `NO`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
    "babybirth": "[date de naissance]"
}
```

**Exemple de requéte**

    localhost:8080/api/notif?babybirth=28.03.2019
    
#### Si aucune notification n'existe pour l'age de l'enfant

```json
{
    "status": 204,
    "log": "No data for day 191"
}
```

#### Si une notification existe pour cette age là

##### Réponse en cas où le contenus se trouve sur Chatfuel
```json
{
    "redirect_to_blocks": [
        "190_Apports des féculents"
    ],
    "set_attributes": {
        "next": 0
    }
}
```
###### Redirect_to_blocks redirige le user sur un block présent sur chatfuel 

##### Réponse si le contenus se trouve sur google Sheet

```json
{
    "messages": [
        {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://images.squarespace-cdn.com/content/5ad8986c1aef1ddf0db431a3/1562145641914-T0H76KBAGW6ZJN8KRO9O/biberon.png?content-type=image%2Fpng"
                }
            }
        }
    ],
    "set_attributes": {
        "next": "N85_1",
        "typing": "0"
    }
}
```
###### Tout ce qui se trouve dans "messages" est la forme que va prendre la réponse du bot sur messenger. "next" est un attribut qui va définir le prochain block de la conversation qui s'affichera après "typing" secondes.


