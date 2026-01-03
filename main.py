import flask

import json
from icalendar import Calendar, Event
from uuid import uuid4
import datetime

def calendar(request: flask.Request) -> flask.Response:
    # We assume that the 'services' and 'regions' GET parameters exist. If they are meeting,
    # the following lookups will error but this is OK.
    services = request.args.get('services').split(',')
    regions = request.args.get('regions').split(',')

    with open('aarau_entsorgung_2026.json', 'r') as file:
        data = json.load(file)
        c = Calendar()
        c.uid = uuid4()
        c.add('name', 'Entsorgungskalender Aarau')
        c.add('X-WR-CALNAME', 'Entsorgungskalender Aarau')
        c.add('prodid', '-//Entsorgungskalender Aarau//mweyland.github.io/entsorgung-aarau/')
        #c.add('prodid', '-//Entsorgungskalender Aarau//FIXME/')
        c.add('version', '2.0')

        for event in data:
            if event['service'] in services:
                if event['region'] is None:
                    e = Event(summary = event['service'], uid=uuid4())
                    e['dtstart;value=date'] = event['date']
                    c.add_component(e)
                if event['region'] in regions:
                    summary = event['service']
                    if len(regions) > 1:
                        summary += f" ({event['region']})"
                    e = Event(summary = summary, uid=uuid4())
                    e['dtstart;value=date'] = event['date']
                    c.add_component(e)

    #last_modified = datetime.datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT")
    headers = {
        'Content-Type': 'text/calendar; charset=UTF-8',
        'Content-Disposition': 'attachment; filename="entsorgung_aarau.ics"',
    }

    return flask.Response(c.to_ical(), 200, headers)
