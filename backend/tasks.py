from invoke import task, run


@task
def build(ctx):
    run('python setup.py sdist --dist-dir ./build')
