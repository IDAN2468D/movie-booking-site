## 🤖 מפת סקילים וחוקים פעילים (AI Context Index)

> [!NOTE]
> קובץ זה מיוצר אוטומטית על ידי Dataview ומשמש כמקור השליפה המרוכז עבור סוכן ה-AI. 
> מיועד למנוע סריקות רוחביות מבוזרות של ה-Vault ולחסוך טוקנים של קלט (Input Tokens).

```dataview
TABLE type AS "סוג", status AS "סטטוס", file.folder AS "מיקום ב-Vault"
FROM #skill OR ""
WHERE type = "skill" OR contains(file.tags, "#skill")
SORT file.name ASC