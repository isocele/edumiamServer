## Getmonth

####  Obtenir l'age de l'enfant

**URL** :  `/getmonth`

**Method** : `GET`

**Auth required** : `NO`

**Type de données** : `application/json`

**Données nécessaires dans le query :**

```json
{
    "babybirth": "[date de naissance]"
}
```

#### Si la date est antérieur à aujourd'hui

**Exemple de requéte**

    http://localhost:8080/api/getmonth?babybirth=24.04.2019
    

```json
{
    "status": 200,
    "set_attributes": {
        "enceinte": false,
        "babyMonth": 3,
        "babyWeek": 14
    }
}
```

#### Si la date est postérieur à aujourd'hui

**Exemple de requéte**

    http://localhost:8080/api/getmonth?babybirth=20.08.2019

```json
{
    "status": 201,
    "set_attributes": {
        "enceinte": true,
        "timebeforebirth": "2 semaine(s)"
    }
}
```
