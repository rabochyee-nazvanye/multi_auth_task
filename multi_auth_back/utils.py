import random
import string
import os

import dlib
import cv2
from scipy.spatial import distance


ENOUGH_DISTANCE = 0.7

shape_predictor = dlib.shape_predictor('multi_auth_back/models/shape_predictor_68_face_landmarks.dat')
face_recognizer = dlib.face_recognition_model_v1('multi_auth_back/models/dlib_face_recognition_resnet_model_v1.dat')
face_detector = dlib.get_frontal_face_detector()

PERSONS = {}


def get_random_string(length):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(length))


def load_image(image_name):
    try:
        return cv2.imread(image_name)
    except:
        pass


def get_most_similar_person(descriptor):
    min_dist = 1000 * ENOUGH_DISTANCE
    most_similar_person = None
    for person, person_descriptor in PERSONS.items():
        dist = distance.euclidean(descriptor, person_descriptor)
        if dist < min_dist:
            min_dist = dist
            most_similar_person = person
    return most_similar_person, min_dist


def get_faces(image):
    return face_detector(image, 1)


def get_descriptor(image, face):
    shape = shape_predictor(image, face)
    if shape:
        descriptor = face_recognizer.compute_face_descriptor(image, shape)
        if descriptor:
                return descriptor
    return None


def recognize_persons(image):
    persons = []
    faces = get_faces(image)
    for face in faces:
        descriptor = get_descriptor(image, face)
        if not descriptor:
            continue
        most_similar_person, min_dist = get_most_similar_person(descriptor)
        if min_dist < ENOUGH_DISTANCE:
            persons.append(most_similar_person)
    return persons


def recognize_persons_by_file(image_name):
    image = load_image(image_name)
    if image is None:
        return None
    return recognize_persons(image)


for filename in os.listdir('multi_auth_back/persons'):
    image = load_image('multi_auth_back/persons/' + filename)
    faces = get_faces(image)
    if len(faces) > 1:
        print('WARNING: too many faces')
    for face in faces:
        descriptor = get_descriptor(image, face)
        if descriptor:
            PERSONS['.'.join(filename.split('.')[:-1])] = descriptor
    print(PERSONS.keys())