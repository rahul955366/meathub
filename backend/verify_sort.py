import math

USER_LAT, USER_LNG = 17.4828, 78.4107

shops = [
  {'name': 'MEATHUB Flagship', 'lat': 17.4935, 'lng': 78.3911, 'is_busy': False},
  {'name': 'Godavari Cuts', 'lat': 17.5003, 'lng': 78.4107, 'is_busy': True},
  {'name': 'Royal Mutton', 'lat': 17.4945, 'lng': 78.3872, 'is_busy': False},
  {'name': 'Heritage', 'lat': 17.4483, 'lng': 78.3915, 'is_busy': False},
]

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

THRESHOLD = 5.0
for s in shops:
    d = haversine(USER_LAT, USER_LNG, s['lat'], s['lng'])
    s['distance'] = round(d, 2)
    s['eff'] = round(d + (0.5 if s['is_busy'] else 0), 2)
    s['near'] = d <= THRESHOLD

nb = sorted([s for s in shops if s['near']], key=lambda x: x['eff'])
far = sorted([s for s in shops if not s['near']], key=lambda x: x['distance'])

print("=== WITH 3 Godavari orders (Busy=True) ===")
for i, s in enumerate(nb + far, 1):
    print("  %d. %s - real: %skm | effective: %skm | busy: %s" % (i, s['name'], s['distance'], s['eff'], s['is_busy']))

print("")
print("=== Godavari FREE (0 orders, busy=False) ===")
for s in shops:
    s['is_busy'] = False
    s['eff'] = s['distance']
nb2 = sorted([s for s in shops if s['near']], key=lambda x: x['eff'])
far2 = sorted([s for s in shops if not s['near']], key=lambda x: x['distance'])
for i, s in enumerate(nb2 + far2, 1):
    print("  %d. %s - %skm | busy: %s" % (i, s['name'], s['distance'], s['is_busy']))
