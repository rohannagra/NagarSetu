# File-Based Database Storage

## 📁 What is this?

This directory contains JSON files that store your application data when MongoDB is not available.

## Files:

- **users.json** - User accounts (citizens, officers, admins)
- **complaints.json** - All submitted complaints
- **departments.json** - Government departments
- **notifications.json** - User notifications

## How it works:

1. When MongoDB is not connected, the app automatically uses these files
2. Data is stored in JSON format
3. Each operation (create, read, update, delete) modifies these files
4. Data persists between server restarts

## Features:

✅ Works without MongoDB installation
✅ Simple JSON format (human-readable)
✅ No setup required
✅ Data persists on disk
✅ Automatic fallback

## Limitations:

⚠️ Slower than MongoDB for large datasets
⚠️ No complex queries
⚠️ No data validation
⚠️ Single-user access (no concurrent writes)
⚠️ Limited to file system storage

## When to use:

- ✅ Development/testing
- ✅ Quick demos
- ✅ Learning the app
- ✅ Small datasets

## When NOT to use:

- ❌ Production deployment
- ❌ Multiple users
- ❌ Large datasets (>1000 records)
- ❌ High performance needs

## Upgrade to MongoDB:

For production use, setup MongoDB:
1. Read: `MONGODB_SETUP.md` in project root
2. Use MongoDB Atlas (free cloud database)
3. Or install MongoDB locally

## Data Format:

Each file contains an array of objects:
```json
[
  {
    "_id": "unique-id",
    "field1": "value1",
    "field2": "value2",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Backup:

To backup your data, simply copy this entire folder!

## Reset:

To reset all data, delete all JSON files. They will be recreated empty.

---

**Your data is safe in these files!** 📦

