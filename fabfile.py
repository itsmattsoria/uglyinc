from fabric.api import *
import os

env.hosts = ['opal4.opalstack.com']
env.user = 'soriamatt'
env.path = '~/Sites/uglyinc'
env.remotepath = '/home/soriamatt/apps/uglyinc'
env.git_branch = 'main'
env.warn_only = True
env.forward_agent = True
env.remote_protocol = 'http'

def deploy(assets='y'):
  update()
  # build and sync production assets
  if assets != 'n':
    local('rm -rf dist')
    local('yarn build:production')
    run('mkdir -p ' + env.remotepath + '/dist')
    put('dist', env.remotepath + '/')

def update():
  with cd(env.remotepath):
    run('git pull origin {0}'.format(env.git_branch))
