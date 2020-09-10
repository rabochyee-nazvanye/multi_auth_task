import base64
import json
import os

from django.shortcuts import render
from django.http import JsonResponse

from .utils import *
from .flag import *


def index(request):
    return render(request, 'index.html')


def recognize(request):
    if request.session.get('recognized', None) is None:
        request.session['recognized'] = {x: False for x in PERSONS.keys()}
    recognized = request.session['recognized']
    photo = base64.b64decode(json.loads(
        request.POST.get('data'))['image'].split(',')[1].strip())
    if photo:
        filename = get_random_string(8)
        file = open('multi_auth_back/tmp/{}.jpg'.format(filename), 'wb')
        file.write(photo)
        file.close()
        persons = recognize_persons_by_file('multi_auth_back/tmp/{}.jpg'.format(filename))
        for person in persons:
            if person in request.session['recognized'].keys():
                recognized[person] = True
        os.remove('multi_auth_back/tmp/{}.jpg'.format(filename))
    request.session['recognized'] = recognized
    return JsonResponse({'result': 'OK', 'data': request.session['recognized'],
                         'flag': None if list(recognized.values()
                                             ).count(False) > 0 else FLAG},
                        status=200)
