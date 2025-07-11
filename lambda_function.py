import json
from icalendar import Calendar, Event
from uuid import uuid4


def lambda_handler(event, context):
    params = event.get('queryStringParameters') or {}
    services = params.get('services').split(',')
    print(services)
    regions = params.get('regions').split(',')


    with open('aarau_entsorgung_2025.json', 'r') as file:
        data = json.load(file)
        c = Calendar()
        c.uid = uuid4()
        c.add('name', 'Entsorgungskalender Aarau')
        c.add('prodid', '-//Entsorgungskalender Aarau//mweyland.github.io/entsorgung-aarau/')
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
        
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/calendar',
            'Content-Disposition': 'inline; filename="entsorgung_aarau.ics"'
        },
        'body': c.to_ical()
    }
