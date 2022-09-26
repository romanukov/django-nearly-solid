from invoke import task, run
from setup import version


@task
def build(ctx):
    run('python setup.py sdist --dist-dir ./build')
    run(f'twine upload -r pypi build/django-nearly-solid-{version}.tar.gz')
